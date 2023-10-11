from starlette.testclient import TestClient

from fastapi_server.resources.database.postgres import create_db_session
from fastapi_server.apps.feature_flags.database.postgres import get_feature_flags_db


async def test_registration_flow(test_app: TestClient):
    # No feature flags
    response = test_app.get("/feature-flags")
    assert response.status_code == 200
    json_response = response.json()
    assert len(json_response) == 0

    # Add two
    db_session = create_db_session()()
    db = get_feature_flags_db(db_session)
    register_enabled = {"codename": "register_enabled", "is_active": True}
    await db.add_feature_flag(register_enabled)
    emails = {"codename": "emails", "is_active": False, "description": "no emails"}
    await db.add_feature_flag(emails)
    await db_session.close()

    # Check
    response = test_app.get("/feature-flags")
    assert response.status_code == 200
    json_response = response.json()
    assert len(json_response) == 2
    assert json_response[0]["is_active"]
    assert json_response[1]["description"] == "no emails"
