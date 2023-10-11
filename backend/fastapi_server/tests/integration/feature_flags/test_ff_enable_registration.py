import json

from starlette.testclient import TestClient

from fastapi_server.resources.database.postgres import create_db_session
from fastapi_server.apps.feature_flags.database.postgres import get_feature_flags_db


async def test_registration_flow(test_app: TestClient):
    # Add
    db_session = create_db_session()()
    db = get_feature_flags_db(db_session)
    register_enabled = {"codename": "FF_ENABLE_REGISTRATION", "is_active": True}
    await db.add_feature_flag(register_enabled)
    await db_session.close()

    # Register, with success
    email = "testuser_ff_register_success@fastapi-next.com"
    register_payload = {
        "email": email,
        "password": "SuperSecret1!",
        "first_name": "Test",
        "last_name": "User",
    }
    response = test_app.post("/register", json=register_payload)
    assert response.status_code == 201
    json_response = response.json()
    assert "id" in json_response

    # Change FF
    db_session = create_db_session()()
    db = get_feature_flags_db(db_session)
    await db.update_feature_flag("FF_ENABLE_REGISTRATION", {"is_active": False})
    await db_session.close()

    # Register, 404
    email = "testuser_ff_register_fail@fastapi-next.com"
    register_payload = {
        "email": email,
        "password": "SuperSecret1!",
        "first_name": "Test",
        "last_name": "User",
    }
    response = test_app.post("/register", json=register_payload)
    assert response.status_code == 404

    # Delete
    db_session = create_db_session()()
    db = get_feature_flags_db(db_session)
    await db.delete_feature_flag("FF_ENABLE_REGISTRATION")
    await db_session.close()
