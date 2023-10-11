from asyncio import sleep
from random import randint
from typing import Optional
from uuid import uuid4, UUID

from structlog import get_logger

from fastapi_server.lib.dates import now

from . import exceptions
from .constants import ErrorCode
from .database.postgres import DB
from .jwt import generate_jwt, decode_jwt
from .models import User
from .password import password_helper
from .schemas import UserCreate, UserTokens, UserRead
from .settings import SETTINGS

__all__ = [
    "create_user",
    "generate_verification_token",
    "verify_user_from_token",
    "authenticate_user",
    "generate_access_token",
    "validate_access_token",
    "generate_refresh_token",
    "generate_authentication_tokens",
    "validate_refresh_token",
    "generate_forgot_password_token",
    "validate_forgot_password_token",
    "change_user_password",
]

logger = get_logger("users")


async def create_user(db: DB, user: UserCreate):
    password_is_valid = password_helper.is_valid_password(user.password)
    if password_is_valid != True:
        exc = exceptions.InvalidPasswordException(ErrorCode.REGISTER_INVALID_PASSWORD)
        exc.reason = str(password_is_valid)
        raise exc

    existing_user = await db.get_user_by_email(user.email)
    if existing_user is not None:
        if existing_user.is_verified:
            raise exceptions.UserAlreadyExists(ErrorCode.REGISTER_USER_ALREADY_EXISTS)
        return existing_user

    user_dict = {
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    user_dict["id"] = str(uuid4().hex)
    user_dict["hashed_password"] = password_helper.hash(user.password)

    created_user = await db.add_user(user_dict)
    return created_user


####################
### REGISTRATION ###
####################


def generate_verification_token(user) -> str:
    registration_code = str(randint(100000, 999999))
    token_data = {
        "user_id": str(user.id),
        "email": user.email,
        "code": registration_code,
        "aud": SETTINGS["VERIFICATION_TOKEN_AUDIENCE"],
    }
    token = generate_jwt(
        token_data,
        SETTINGS["VERIFICATION_SECRET"],
        SETTINGS["VERIFICATION_LIFETIME_SECONDS"],
    )
    return token, registration_code


async def verify_user_from_token(db: DB, token: str, registration_code: str) -> bool:
    try:
        data = decode_jwt(
            token,
            SETTINGS["VERIFICATION_SECRET"],
            [SETTINGS["VERIFICATION_TOKEN_AUDIENCE"]],
        )
    except Exception:
        raise exceptions.InvalidVerifyToken()

    try:
        user_id = data["user_id"]
        email = data["email"]
        code = data["code"]
    except KeyError:
        raise exceptions.InvalidVerifyToken()

    verification = {"verified": False}

    try:
        user = await db.get_user_by_email(email)
    except Exception:
        logger.warn("verify_user_token_invalid_email", **data)
        return verification

    if user_id != user.id:
        logger.warn("verify_user_token_different_user", **data)
        return verification

    if code != registration_code:
        logger.warn("verify_user_token_invalid_code", **data)
        return verification

    if user.is_verified:
        logger.warn("verify_user_token_user_already_verified", **data)
        return verification

    verification["verified"] = True
    verification["user_data"] = data
    await db.update_user(user.id, {"is_verified": True}, False)

    return verification


async def activate_user(db: DB, email: str) -> Optional[UserRead]:
    user = await db.get_user_by_email(email)
    if not user:
        raise exceptions.UserDoesNotExists()

    update = {"is_active": True, "login_failed_count": 0}
    await db.update_user(user.id, update)
    return user


######################
### AUTHENTICATION ###
######################


async def increment_failed_login_count(db: DB, email: str):
    # TODO: global setting for failed tentative
    failed_user = await db.get_user_by_email(email)
    update_data = {"login_failed_count": (failed_user.login_failed_count or 0) + 1}
    if update_data["login_failed_count"] == 5:
        update_data["is_active"] = False

    updated_user = await db.update_user(failed_user.id, update_data)
    return updated_user


async def authenticate_user(db: DB, email: str, password: str) -> Optional[UserRead]:
    try:
        user = await db.get_user_by_email(email)
        if not user:
            raise exceptions.UserDoesNotExists
    except exceptions.UserDoesNotExists:
        # Run the hasher to mitigate timing attack
        # Inspired from Django: https://code.djangoproject.com/ticket/20760
        password_helper.hash(password)
        await sleep(randint(200, 1000))
        return None

    verified, updated_password_hash = password_helper.verify_and_update(
        password, user.hashed_password
    )
    if not verified:
        return None

    update = {"last_login": now(format=None).naive, "login_failed_count": 0}
    if updated_password_hash is not None:
        update.update({"hashed_password": updated_password_hash})
    await db.update_user(user.id, update)

    return user


def generate_access_token(user: User):
    data = {
        "user_id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "aud": SETTINGS["ACCESS_TOKEN_AUDIENCE"],
    }
    return generate_jwt(
        data, SETTINGS["ACCESS_TOKEN_SECRET"], SETTINGS["ACCESS_TOKEN_EXPIRE_SECONDS"]
    )


async def validate_access_token(token: str):
    data = decode_jwt(
        token, SETTINGS["ACCESS_TOKEN_SECRET"], [SETTINGS["ACCESS_TOKEN_AUDIENCE"]]
    )
    try:
        UUID(data["user_id"])
    except:
        raise exceptions.InvalidUserId
    return data


def generate_refresh_token(user_id: str):
    data = {"user_id": user_id, "aud": SETTINGS["REFRESH_TOKEN_AUDIENCE"]}
    return generate_jwt(
        data, SETTINGS["REFRESH_TOKEN_SECRET"], SETTINGS["REFRESH_TOKEN_EXPIRE_SECONDS"]
    )


async def generate_authentication_tokens(user: UserTokens):
    return {
        "access_token": generate_access_token(user),
        "refresh_token": generate_refresh_token(user.id),
        "token_type": "bearer",
    }


async def validate_refresh_token(token: str):
    data = decode_jwt(
        token, SETTINGS["REFRESH_TOKEN_SECRET"], [SETTINGS["REFRESH_TOKEN_AUDIENCE"]]
    )
    try:
        UUID(data["user_id"])
    except:
        raise exceptions.InvalidUserId
    return data


#######################
### FORGOT PASSWORD ###
#######################


async def generate_forgot_password_token(user_id: str):
    data = {"user_id": user_id, "aud": SETTINGS["FORGOT_PASSWORD_TOKEN_AUDIENCE"]}
    return generate_jwt(
        data,
        SETTINGS["FORGOT_PASSWORD_TOKEN_SECRET"],
        SETTINGS["FORGOT_PASSWORD_TOKEN_EXPIRE_SECONDS"],
    )


async def validate_forgot_password_token(token: str):
    data = decode_jwt(
        token,
        SETTINGS["FORGOT_PASSWORD_TOKEN_SECRET"],
        [SETTINGS["FORGOT_PASSWORD_TOKEN_AUDIENCE"]],
    )
    try:
        UUID(data["user_id"])
    except:
        raise exceptions.InvalidUserId
    return data["user_id"]


async def change_user_password(db: DB, user: User, password: str):
    if not user:
        raise exceptions.UserDoesNotExists()

    password_is_valid = password_helper.is_valid_password(password)
    if password_is_valid != True:
        exc = exceptions.InvalidPasswordException(
            ErrorCode.RESET_PASSWORD_INVALID_PASSWORD
        )
        exc.reason = password_is_valid
        raise exc

    update = {"hashed_password": password_helper.hash(password)}
    await db.update_user(user.id, update)

    return user
