from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from fastapi.exceptions import HTTPException
from structlog import get_logger

from fastapi_server.lib.logs import exception_to_string
from fastapi_server.lib.pagination import PageParams, PaginatedResponse
from fastapi_server.resources.database.postgres import get_db_session
from fastapi_server.resources.database.database import get_databases

from fastapi_server.apps.users.auth import with_active_user
from fastapi_server.apps.users.schemas import ActiveUser
from ..database.postgres import TodosDB, get_todos_db
from ..entitlements import todo_with_permissions
from ..schemas import TodoRead, TodoCreate, TodoUpdate
from .. import core
from .schemas import TodoOrderParams

logger = get_logger("todos")

router = APIRouter(
    prefix="/todos", tags=["todos"], responses={404: {"description": "Not found"}}
)


@router.get(
    "/todos",
    name="todos:todos:get-todos",
    response_description="Get all To-Dos for the logged user",
    response_model=PaginatedResponse[TodoRead],
)
async def get_todos(
    page_params: PageParams = Depends(),
    todo_order_params: TodoOrderParams = Depends(),
    db: TodosDB = Depends(get_todos_db),
    user: ActiveUser = Depends(with_active_user),
):
    todos, total = await db.get_todos_by_owner(
        user.user_id,
        order_by=todo_order_params.order_by,
        order_direction=todo_order_params.order_direction,
        page=page_params.page,
        page_size=page_params.page_size,
    )
    logger.info(
        "Get todos",
        code="todos-get_todos",
        user_id=user.user_id,
        todos=len(todos),
        total=total,
        page_params=page_params.model_dump(),
    )
    return {"results": todos, "total": total}


@router.post("/todos", name="todos:todos:add-todo", status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_create: TodoCreate,
    db: TodosDB = Depends(get_todos_db),
    user: ActiveUser = Depends(with_active_user),
):
    created_todo = await core.create_todo(db, user.user_id, todo_create)
    logger.info(
        "Create todo",
        code="todos-create_todo",
        user_id=user.user_id,
        todo_id=str(created_todo.id),
    )
    return created_todo


@router.patch(
    "/todos/{todo_id}", name="todos:todos:update-todo", response_model=TodoRead
)
async def update_todo(
    todo_id: UUID,
    todo_update: TodoUpdate,
    session=Depends(get_db_session),
    user: ActiveUser = Depends(with_active_user),
):
    dbs = get_databases(session)
    log_kwargs = {
        "code": "todos-update_todo",
        "user_id": user.user_id,
        "todo_id": str(todo_id),
    }
    await todo_with_permissions(
        dbs,
        todo_id,
        user.user_id,
        True,
    )
    try:
        updated_todo = await core.update_todo(
            dbs["todos"], user.user_id, todo_id, todo_update
        )
    except Exception as e:
        logger.error("Update todo", exception=exception_to_string(e), **log_kwargs)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    logger.info("Update todo", **log_kwargs)
    return updated_todo


@router.post(
    "/todos/{todo_id}/toggle", name="todos:todos:toggle-todo", response_model=TodoRead
)
async def toggle_todo(
    todo_id: UUID,
    session=Depends(get_db_session),
    user: ActiveUser = Depends(with_active_user),
):
    dbs = get_databases(session)
    log_kwargs = {
        "code": "todos-toggle_todo",
        "user_id": user.user_id,
        "todo_id": str(todo_id),
    }
    todo, _ = await todo_with_permissions(
        dbs,
        todo_id,
        user.user_id,
    )
    try:
        updated_todo = await core.toggle_todo(dbs["todos"], user.user_id, todo)
    except Exception as e:
        logger.error("Toggle todo", exception=exception_to_string(e), **log_kwargs)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    logger.info("Toggle todo", **log_kwargs)
    return updated_todo


@router.delete(
    "/todos/{todo_id}",
    name="todos:todos:delete-todo",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_todo(
    todo_id: UUID,
    session=Depends(get_db_session),
    user: ActiveUser = Depends(with_active_user),
):
    dbs = get_databases(session)
    log_kwargs = {
        "code": "todos-delete_todo",
        "user_id": user.user_id,
        "todo_id": str(todo_id),
    }
    await todo_with_permissions(dbs, todo_id, user.user_id, True)
    try:
        await core.delete_todo(dbs["todos"], todo_id)
    except Exception as e:
        logger.error("Delete todo", exception=str(e), **log_kwargs)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    logger.info("Delete todo", **log_kwargs)

    return None


"""
BY PROJECT
"""


@router.get(
    "/projects/{project_id}",
    name="todos:projects:get-project-todos",
    response_description="Get all To-Dos for the specified project",
    response_model=PaginatedResponse[TodoRead],
)
async def get_project_todos(
    project_id: UUID,
    page_params: PageParams = Depends(),
    todo_order_params: TodoOrderParams = Depends(),
    session=Depends(get_db_session),
    user: ActiveUser = Depends(with_active_user),
):
    dbs = get_databases(session)

    project_member = await dbs["projects"].get_project_member_by_key(
        project_id, user.user_id
    )
    if not project_member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    todos, total = await dbs["todos"].get_todos_by_project_id(
        project_id,
        order_by=todo_order_params.order_by,
        order_direction=todo_order_params.order_direction,
        page=page_params.page,
        page_size=page_params.page_size,
    )
    logger.info(
        "Get project todos",
        code="todos-get_project_todos",
        project_id=str(project_id),
        user_id=user.user_id,
        todos=len(todos),
        total=total,
        page_params=page_params.model_dump(),
    )
    return {"results": todos, "total": total}
