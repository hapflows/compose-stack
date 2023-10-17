from starlette.testclient import TestClient

from fastapi_server.main import app
from fastapi_server.tests.utils import (
    assert_response,
    create_test_user,
    user_to_active_user,
)
from fastapi_server.apps.users.auth import with_active_user


async def test_todos_projects(test_app: TestClient):
    user1 = await create_test_user("todos_projects_user1@compose-stack.com")
    user2 = await create_test_user("todos_projects_user2@compose-stack.com")

    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user1)

    # Create a new Todo
    todo_payload = {"title": "Buy milk", "description": None, "project_id": None}
    response = test_app.post("/todos/todos", json=todo_payload)
    todo = assert_response(response, 201)

    # Create a new Project
    todo_payload = {"name": "Software Project", "description": "like this one"}
    response = test_app.post("/projects/projects", json=todo_payload)
    project = assert_response(response, 201)["project"]

    # Add user2 as Project Member, without admin permissions
    response = test_app.post(
        f"/projects/projects/{project['id']}/members",
        json={"user_email": user2.email, "is_admin": False},
    )
    assert_response(response, 201)

    # Add a new Todo in Project
    todo_payload = {
        "title": "Buy milk",
        "description": None,
        "project_id": project["id"],
    }
    response = test_app.post("/todos/todos", json=todo_payload)
    todo2 = assert_response(response, 201)

    # Get Todos for user1, should be 2: personal and project
    response = test_app.get(f"/todos/todos")
    todos_resp = assert_response(response, 200)
    todos = todos_resp["results"]
    assert len(todos) == 2
    assert todos[0]["id"] == todo["id"]
    assert todos[1]["id"] == todo2["id"]

    # Get Todos for Project
    response = test_app.get(f"/todos/projects/{project['id']}")
    todos_resp = assert_response(response, 200)
    assert len(todos_resp["results"]) == 1
    assert todos_resp["results"][0]["id"] == todo2["id"]

    # Switch as User2: should be able to see the Todo, toggle, but not edit or delete
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user2)

    # See
    response = test_app.get(f"/todos/projects/{project['id']}")
    todos = assert_response(response, 200)
    assert len(todos_resp["results"]) == 1
    assert todos_resp["results"][0]["id"] == todo2["id"]

    # Toggle
    response = test_app.post(f"/todos/todos/{todo2['id']}/toggle", json={})
    todo = assert_response(response, 200)
    assert todo["completed_by"] == user2.id
    assert todo["completed_on"]

    # Edit
    edit_todo2_payload = {"title": "Buy milk and bread"}
    response = test_app.patch(f"/todos/todos/{todo2['id']}", json=edit_todo2_payload)
    assert_response(response, 401)

    # Delete
    response = test_app.delete(f"/todos/todos/{todo2['id']}")
    assert_response(response, 401, False)

    # Change permissions to be an admin
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user1)
    response = test_app.patch(
        f"/projects/projects/{project['id']}/members/{user2.id}",
        json={"is_admin": True},
    )
    assert_response(response, 200)

    # Try to edit and delete again, should succeed
    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user2)

    # Edit
    response = test_app.patch(f"/todos/todos/{todo2['id']}", json=edit_todo2_payload)
    edited_todo2 = assert_response(response, 200)
    assert edited_todo2["updated_by"] == user2.id
    assert edited_todo2["updated_on"]
    assert edited_todo2["title"] == edit_todo2_payload["title"]
    assert edited_todo2["description"] == todo2["description"]

    # Delete
    response = test_app.delete(f"/todos/todos/{todo2['id']}")
    assert_response(response, 204, False)

    del app.dependency_overrides[with_active_user]
