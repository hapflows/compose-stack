from starlette.testclient import TestClient

from fastapi_server.main import app
from fastapi_server.tests.utils import (
    assert_response,
    create_test_user,
    user_to_active_user,
)
from fastapi_server.apps.users.auth import with_active_user


async def test_project_members(test_app: TestClient):
    user1 = await create_test_user("project_members_user1@compose-stack.com")
    user2_email = "project_members_user2@compose-stack.com"
    user2 = await create_test_user(user2_email)
    user3_email = "project_members_user3@compose-stack.com"
    user3 = await create_test_user(user3_email)

    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user1)

    # Create a new Project
    # User1 is added as Project Member with admin permission
    project_payload = {"name": "Test Project Members", "description": None}
    response = test_app.post("/projects/projects", json=project_payload)
    project_and_member = assert_response(response, 201)
    project = project_and_member["project"]
    project_member = project_and_member["project_member"]
    assert project_member["user_id"] == user1.id
    assert project_member["is_admin"]

    # Edit the Project as User2, which is not in the project
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user2)

    edit_project_payload = {"name": "Updated Project", "description": "Important one!"}
    response = test_app.patch(
        f"/projects/projects/{project['id']}", json=edit_project_payload
    )
    assert_response(response, 401, False)

    # Add User2 as non-admin
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user1)

    response = test_app.post(
        f"/projects/projects/{project['id']}/members",
        json={"user_email": user2_email, "is_admin": False},
    )
    project_member2 = assert_response(response, 201)
    assert project_member2["user_id"] == user2.id

    # Get project members should return 2
    response = test_app.get(f"/projects/projects/{project['id']}/members")
    members = assert_response(response, 200)
    assert len(members) == 2

    # Try to edit the project again, should still fail with Unauthorized
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user2)

    response = test_app.patch(
        f"/projects/projects/{project['id']}", json=edit_project_payload
    )
    assert_response(response, 401, False)

    # Try to delete the project: should fail
    response = test_app.delete(f"/projects/projects/{project['id']}")
    assert_response(response, 401, False)

    # Edit user2 with admin permissions
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user1)
    response = test_app.patch(
        f"/projects/projects/{project['id']}/members/{user2.id}",
        json={"is_admin": True},
    )
    assert_response(response, 200)

    # Try to edit the project again as user2
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user2)

    response = test_app.patch(
        f"/projects/projects/{project['id']}", json=edit_project_payload
    )
    project = assert_response(response, 200)
    assert project["updated_by"] == user2.id

    # Delete the project as user2
    response = test_app.delete(f"/projects/projects/{project['id']}")
    assert_response(response, 204, False)

    del app.dependency_overrides[with_active_user]
