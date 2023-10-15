from starlette.testclient import TestClient

from fastapi_server.main import app
from fastapi_server.tests.utils import (
    assert_response,
    create_test_user,
    user_to_active_user,
)
from fastapi_server.apps.users.auth import with_active_user


async def test_projects(test_app: TestClient):
    user = await create_test_user("projects_user@compose-stack.com")

    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user)

    # Create a new Project
    # The user is added as Project Member with admin permission
    project_payload = {"name": "Test Project", "description": "First project"}
    response = test_app.post("/projects/projects", json=project_payload)
    project_and_member = assert_response(response, 201)
    project = project_and_member["project"]
    assert "id" in project
    assert project["created_by"] == user.id
    assert project["created_on"]
    assert project["name"] == project_payload["name"]
    project_member = project_and_member["project_member"]
    assert project_member["project_id"] == project["id"]
    assert project_member["user_id"] == user.id
    assert project_member["is_admin"]

    # Edit the Project
    edit_project_payload = {"name": "Updated Project", "description": "Important one!"}
    response = test_app.patch(
        f"/projects/projects/{project['id']}", json=edit_project_payload
    )
    project = assert_response(response, 200)
    assert project["updated_by"] == user.id
    assert project["updated_on"]
    assert project["name"] == edit_project_payload["name"]
    assert project["description"] == edit_project_payload["description"]

    # Get the Project
    response = test_app.get(f"/projects/projects")
    projects = assert_response(response, 200)
    assert len(projects) == 1
    assert projects[0]["id"] == project["id"]

    # Delete the Project
    response = test_app.delete(f"/projects/projects/{project['id']}")
    assert_response(response, 204, False)

    del app.dependency_overrides[with_active_user]
