import os

from fastapi import (
    APIRouter,
    Body,
    HTTPException,
    status,
    Depends,
)
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from structlog import get_logger

from fastapi_server.config import get_settings
from fastapi_server.lib.logs import exception_to_string
from fastapi_server.resources.database.postgres import get_db_session
from fastapi_server.resources.database.database import get_databases
from fastapi_server.apps.feature_flags.models import FeatureFlag
from fastapi_server.apps.notifications.mail import send_mail

from .. import exceptions
from .. import core
from ..auth import with_active_user
from ..constants import ErrorCode
from ..database.postgres import DB, get_user_db
from ..schemas import (
    UserCreate,
    UserTokens,
    UserRead,
    UserPasswordReset,
    ActiveUser,
    UserUpdate,
    RegistrationTokenCode,
)
from ..settings import SETTINGS

from .responses import register_responses, verify_responses, login_responses

logger = get_logger("users")

router = APIRouter(
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.get("/users", response_description="List all users")
async def get_users(
    db: DB = Depends(get_user_db), user: UserTokens = Depends(with_active_user)
):
    total = await db.count_users()
    users = await db.get_users()
    return {
        "data": [UserRead(**u.dict()) for u in users],
        "total": total,
    }


#################
### USER DATA ###
#################


@router.get(
    "/users/user",
    response_description="Get a single user",
    response_model=UserRead,
)
async def get_user(
    db: DB = Depends(get_user_db),
    user: ActiveUser = Depends(with_active_user),
):
    user_db = await db.get_user_by_id(user.user_id)
    if user_db:
        return user_db
    raise HTTPException(status_code=404, detail=f"User {user.user_id} not found")


@router.patch("/users/user", response_model=UserRead)
async def update_user(
    user_data: UserUpdate,
    db: DB = Depends(get_user_db),
    user: ActiveUser = Depends(with_active_user),
):
    update_data = user_data.dict(exclude_unset=True)
    try:
        updated_user = await db.update_user(user.user_id, update_data)
    except Exception as e:
        logger.error(
            f"Update user {user.user_id}",
            code="users-update_user",
            user_id=user.user_id,
            user_update=user_data.dict(),
            exception=exception_to_string(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return updated_user


####################
### REGISTRATION ###
####################


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    name="users:register:register",
    responses=register_responses,
)
async def register(user_create: UserCreate, session=Depends(get_db_session)):
    dbs = get_databases(session)

    # By default, enable registration (i.e. in tests)
    enabled = True
    ff_enable_registration: FeatureFlag = await dbs[
        "feature_flags"
    ].get_feature_flag_by_codename("FF_ENABLE_REGISTRATION")
    if ff_enable_registration:
        enabled = ff_enable_registration.is_active

    if not enabled:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    try:
        created_user = await core.create_user(dbs["users"], user_create)
    except exceptions.UserAlreadyExists as e:
        logger.error(
            f"User tries to register again",
            code="users-register_user_already_exists",
            user_email=user_create.email,
            exception=exception_to_string(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": str(ErrorCode.REGISTER_USER_ALREADY_EXISTS)},
        )
    except exceptions.InvalidPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": str(ErrorCode.REGISTER_INVALID_PASSWORD),
                "reason": e.reason,
            },
        )

    logger.info(
        f"User registered",
        code="users-new_user_created",
        user_id=str(created_user.id),
    )

    return created_user


@router.post(
    "/auth/request-verification-token",
    status_code=status.HTTP_202_ACCEPTED,
    name="users:verify:request-token",
)
async def request_verify_token(
    email: EmailStr = Body(..., embed=True), db: DB = Depends(get_user_db)
):
    user = await db.get_user_by_email(email)
    if not user:
        raise exceptions.UserDoesNotExists()
    if not user.is_active:
        raise exceptions.UserInactive()
    if user.is_verified:
        raise exceptions.UserAlreadyVerified()

    verification_token, registration_code = core.generate_verification_token(user)

    send_mail(
        "Registration Code",
        [{"name": user.first_name, "email": user.email}],
        [user.id],
        template_path="users/user_registration_code",
        variables={
            "registration_code": registration_code,
            "first_name": user.first_name,
        },
    )

    response = {"verification_token": verification_token}
    if SETTINGS["RETURN_VERIFICATION_TOKENS"]:
        response["registration_code"] = registration_code

    return JSONResponse(status_code=status.HTTP_200_OK, content=response)


@router.post("/auth/verify", name="users:verify:verify", responses=verify_responses)
async def verify(
    registration_codes: RegistrationTokenCode, session=Depends(get_db_session)
):
    dbs = get_databases(session)
    db = dbs["users"]
    settings = get_settings()

    token = registration_codes.token
    registration_code = registration_codes.registration_code

    if not token or not registration_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.VERIFY_USER_BAD_TOKEN),
        )

    verification = await core.verify_user_from_token(db, token, registration_code)
    if not verification["verified"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.VERIFY_USER_BAD_TOKEN),
        )

    user = await db.get_user_by_id(verification["user_data"]["user_id"])
    send_mail(
        "Welcome!",
        [{"name": user.first_name, "email": user.email}],
        [user.id],
        template_path="users/user_welcome",
        variables={
            "first_name": user.first_name,
            "login_action": "Login",
            "login_url": f"{settings.app_url}/login",
        },
    )

    return {"verified": True}


# /login is used by docs
@router.post("/login", name=f"auth:login:login", responses=login_responses)
@router.post("/users/login", name=f"auth:login:login", responses=login_responses)
async def login(
    credentials: OAuth2PasswordRequestForm = Depends(), db: DB = Depends(get_user_db)
):
    username = credentials.username
    # Allow for multi accounts in dev, where you want to test registration
    # process with aliases like user+1@domain.com .
    # Disabled for production and test.
    if os.getenv("ENVIRONMENT") == "dev":
        username = username.replace(" ", "+")

    user = await core.authenticate_user(db, username, credentials.password)

    if user is None or not user.is_active:
        if user is None:
            await core.increment_failed_login_count(db, credentials.username)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.LOGIN_BAD_CREDENTIALS),
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.LOGIN_USER_NOT_VERIFIED),
        )

    # Generate tokens
    response = await core.generate_authentication_tokens(user)
    response["access_token_expiration"] = SETTINGS["ACCESS_TOKEN_EXPIRE_SECONDS"]
    response["refresh_token_expiration"] = SETTINGS["REFRESH_TOKEN_EXPIRE_SECONDS"]

    logger.info(
        f"User logged in",
        code="USER_LOGIN",
        user_id=user.id,
    )

    return JSONResponse(status_code=status.HTTP_200_OK, content=response)


@router.post(
    "/auth/refresh-tokens",
    name=f"auth:refresh-tokens:refresh-tokens",
)
async def refresh_tokens(
    token: str = Body(..., embed=True), db: DB = Depends(get_user_db)
):
    try:
        data = await core.validate_refresh_token(token)
    except Exception as e:
        logger.error(f"Refresh token invalid", exception=exception_to_string(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.REFRESH_TOKEN_INVALID),
        )

    user = await db.get_user_by_id(data["user_id"])
    if not user:
        logger.error(f"Refresh token without user", data=data)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.REFRESH_TOKEN_INVALID),
        )

    try:
        access_token = core.generate_access_token(user)
    except Exception as e:
        logger.error(
            f"Refresh token cant generate access token",
            exception=exception_to_string(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ErrorCode.REFRESH_TOKEN_INVALID),
        )

    response = {
        "access_token": access_token,
        "access_token_expiration": SETTINGS["ACCESS_TOKEN_EXPIRE_SECONDS"],
        "token_type": "bearer",
    }

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=response,
    )


@router.post(
    "/auth/forgot-password",
    name=f"auth:forgot-password:forgot-password",
)
async def forgot_password(
    email: str = Body(..., embed=True), db: DB = Depends(get_user_db)
):
    settings = get_settings()

    try:
        user = await db.get_user_by_email(email)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        forgot_password_token = await core.generate_forgot_password_token(str(user.id))
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    send_mail(
        "Reset Password link",
        [{"name": user.first_name, "email": user.email}],
        [user.id],
        template_path="users/user_forgot_password",
        variables={
            "first_name": user.first_name,
            "reset_url": f"{settings.app_url}/forgot-password/reset?reset_token={forgot_password_token}",
            "reset_action": "Click here to reset your password",
        },
    )

    response = {"token_sent": True}
    if SETTINGS["RETURN_FORGOT_PASSWORD_TOKEN"]:
        response["forgot_password_token"] = forgot_password_token

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=response,
    )


@router.post(
    "/auth/reset-password",
    response_model=UserRead,
    name=f"auth:forgot-password:reset-password",
)
async def reset_password(parameters: UserPasswordReset, db: DB = Depends(get_user_db)):
    # TODO: Check if the token has already been used (Redis blacklist)
    try:
        user = await db.get_user_by_email(parameters.email)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    user_id = await core.validate_forgot_password_token(parameters.token)
    try:
        if not user_id:
            raise
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if not user or user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    await core.change_user_password(db, user, parameters.password)
    # TODO: blacklist token

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"password_reset": True},
    )
