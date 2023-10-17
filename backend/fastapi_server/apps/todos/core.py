from datetime import datetime
from typing import Union
from uuid import UUID

from fastapi_server.lib.dates import now

from .database.postgres import TodosDB
from .models import Todo
from .schemas import TodoCreate, TodoToggleUpdate, TodoUpdate


async def create_todo(db: TodosDB, user_id: str, todo: TodoCreate) -> Todo:
    todo_dict = todo.model_dump(exclude_unset=True)
    todo_dict["owner"] = user_id
    todo_dict["created_by"] = user_id
    todo_dict["updated_by"] = user_id
    created_todo = await db.add_todo(todo_dict)
    return created_todo


async def update_todo(
    db: TodosDB,
    user_id: str,
    todo_id: UUID,
    todo: Union[TodoUpdate, TodoToggleUpdate],
) -> Todo:
    update_data = todo.model_dump(exclude_unset=True)
    update_data["updated_by"] = user_id
    update_data["updated_on"] = datetime.now()
    updated_todo = await db.update_todo(todo_id, update_data)
    return updated_todo


async def toggle_todo(db: TodosDB, user_id: str, todo: Todo) -> Todo:
    if not todo.completed_on:
        completed_on = now(format=False).naive
        completed_by = user_id
    else:
        completed_on = None
        completed_by = None

    todo_update = TodoToggleUpdate(completed_on=completed_on, completed_by=completed_by)
    return await update_todo(db, user_id, todo.id, todo_update)


async def delete_todo(db: TodosDB, todo_id: UUID) -> Todo:
    todo = await db.get_todo_by_id(todo_id)
    await db.delete_todo_by_id(todo_id)
    return todo
