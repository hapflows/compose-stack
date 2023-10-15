import pprint

from requests import Response

from fastapi_server.resources.database.postgres import create_db_session
from fastapi_server.apps.users.core import create_user
from fastapi_server.apps.users.database.postgres import get_user_db
from fastapi_server.apps.users.models import User
from fastapi_server.apps.users.schemas import ActiveUser, UserCreate


def user_to_active_user(user: User) -> ActiveUser:
    return ActiveUser(
        user_id=user.id,
        email=user.email,
        first_name=user.first_name,
    )


def user_dict_to_active_user(user: dict) -> ActiveUser:
    return ActiveUser(
        user_id=user["id"],
        email=user["email"],
        first_name=user["first_name"],
    )


async def create_test_user(email: str):
    db_session = create_db_session()()
    users_db = get_user_db(db_session)
    user = await create_user(
        users_db,
        UserCreate(
            email=email,
            password="SuperSecret1!",
            first_name="Test",
            last_name="User",
            is_active=True,
            is_verified=True,
        ),
    )
    await db_session.close()
    assert user.id is not None
    return user


def assert_response(response: Response, status_code, return_json=True):
    try:
        assert response.status_code == status_code
    except Exception as e:
        print("=============== FAILED RESPONSE ==============")
        pprint.pprint(response.text)
        print("================ END RESPONSE ================")
        raise e

    if return_json:
        return response.json()
