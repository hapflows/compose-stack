from requests import Response
from fastapi_server.apps.users.models import User
from fastapi_server.apps.users.schemas import ActiveUser


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


def assert_response(response: Response, status_code):
    try:
        assert response.status_code == status_code
    except Exception as e:
        print("=============== FAILED RESPONSE ==============")
        import pprint

        pprint.pprint(response.text)
        print("================ END RESPONSE ================")
        raise e
