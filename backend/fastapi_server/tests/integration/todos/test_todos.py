from starlette.testclient import TestClient

from fastapi_server.main import app
from fastapi_server.tests.utils import (
    assert_response,
    create_test_user,
    user_to_active_user,
)
from fastapi_server.apps.users.auth import with_active_user


async def test_todos(test_app: TestClient):
    user = await create_test_user("todos_user@compose-stack.com")

    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user)

    # Create a new Todo
    todo_payload = {"title": "Buy milk", "description": None, "project_id": None}
    response = test_app.post("/todos/todos", json=todo_payload)
    todo = assert_response(response, 201)
    assert "id" in todo
    assert todo["created_by"] == user.id
    assert todo["created_on"]
    assert todo["title"] == todo_payload["title"]
    assert todo["description"] == todo_payload["description"]
    assert todo["project_id"] == todo_payload["project_id"]
    assert todo["owner"] == user.id

    # Edit Todo
    edit_todo_payload = {"title": "Buy milk and bread", "description": "Important one!"}
    response = test_app.patch(f"/todos/todos/{todo['id']}", json=edit_todo_payload)
    todo = assert_response(response, 200)
    assert todo["updated_by"] == user.id
    assert todo["updated_on"]
    assert todo["title"] == edit_todo_payload["title"]
    assert todo["description"] == edit_todo_payload["description"]

    # Get the Todos (paginated)
    response = test_app.get(f"/todos/todos")
    todos_resp = assert_response(response, 200)
    assert len(todos_resp["results"]) == todos_resp["total"]
    todos = todos_resp["results"]
    assert todos[0]["id"] == todo["id"]

    # Toggle
    response = test_app.post(f"/todos/todos/{todo['id']}/toggle", json={})
    todo = assert_response(response, 200)
    assert todo["completed_by"] == user.id
    assert todo["completed_on"]

    response = test_app.post(f"/todos/todos/{todo['id']}/toggle", json={})
    todo = assert_response(response, 200)
    assert todo["completed_by"] is None
    assert todo["completed_on"] is None

    # Delete the Todo
    response = test_app.delete(f"/todos/todos/{todo['id']}")
    assert_response(response, 204, False)

    del app.dependency_overrides[with_active_user]


async def test_todos_pagination(test_app: TestClient):
    user = await create_test_user("todos_pagination_user@compose-stack.com")

    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user)

    # Create 12 Todos
    for i in range(1, 13):
        todo_payload = {"title": f"Todo {i}"}
        response = test_app.post("/todos/todos", json=todo_payload)
        assert_response(response, 201)

    # Get the Todos (paginated)
    response = test_app.get(f"/todos/todos?page_size=5")
    todos_resp = assert_response(response, 200)
    assert len(todos_resp["results"]) == 5
    assert todos_resp["total"] == 12
    todos = todos_resp["results"]

    response = test_app.get(f"/todos/todos?page_size=5&page=2")
    todos_resp = assert_response(response, 200)
    assert len(todos_resp["results"]) == 5
    assert todos_resp["total"] == 12

    response = test_app.get(f"/todos/todos?page_size=5&page=3")
    todos_resp = assert_response(response, 200)
    assert len(todos_resp["results"]) == 2
    assert todos_resp["total"] == 12


async def test_todos_order_by(test_app: TestClient):
    user = await create_test_user("todos_order_user@compose-stack.com")

    app.dependency_overrides[with_active_user] = lambda: user_to_active_user(user)

    # Create 12 Todos
    for i in range(1, 13):
        todo_payload = {"title": f"Todo {i}"}
        response = test_app.post("/todos/todos", json=todo_payload)
        assert_response(response, 201)

    # Get the Todos: order by title, implicit direction asc
    # Order is lexicographical , i.e. 1,10,11,12,2, ...
    response = test_app.get(f"/todos/todos?page_size=5&order_by=title")
    todos_resp = assert_response(response, 200)
    todos = todos_resp["results"]
    assert todos[0]["title"] == "Todo 1"
    assert todos[1]["title"] == "Todo 10"
    assert todos[2]["title"] == "Todo 11"
    assert todos[3]["title"] == "Todo 12"
    assert todos[4]["title"] == "Todo 2"

    # Get the Todos: order by title, descending
    response = test_app.get(
        f"/todos/todos?page_size=5&order_by=title&order_direction=desc"
    )
    todos_resp = assert_response(response, 200)
    todos = todos_resp["results"]
    assert todos[0]["title"] == "Todo 9"
    assert todos[4]["title"] == "Todo 5"

    # Get the Todos: order by created_on, ascending
    response = test_app.get(
        f"/todos/todos?page_size=5&order_by=created_on&order_direction=asc"
    )
    todos_resp = assert_response(response, 200)
    todos = todos_resp["results"]
    assert todos[0]["title"] == "Todo 1"
    assert todos[4]["title"] == "Todo 5"

    # Get the Todos: order by created_on, descending
    response = test_app.get(
        f"/todos/todos?page_size=5&order_by=created_on&order_direction=desc"
    )
    todos_resp = assert_response(response, 200)
    todos = todos_resp["results"]
    assert todos[0]["title"] == "Todo 12"
    assert todos[4]["title"] == "Todo 8"
