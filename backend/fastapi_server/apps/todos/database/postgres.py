from typing import Dict, List, Tuple
from uuid import UUID

from fastapi import Depends
from sqlalchemy import update, delete, select, text as sa_text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from fastapi_server.apps.todos.schemas import TodoOrderByType

from fastapi_server.resources.database.postgres import (
    OrderDirectionType,
    get_db_session,
    paginate_query,
)
from ..models import Todo


class TodosDB:
    session: Session

    def __init__(self, session: Session):
        self.session = session

    async def get_todos_by_owner(
        self,
        owner: str,
        *,
        order_by: TodoOrderByType = "created_on",
        order_direction: OrderDirectionType = "asc",
        page: int = 1,
        page_size: int = 10,
    ) -> List[Todo]:
        order = (
            sa_text(f"{order_by} desc")
            if order_direction == "desc"
            else sa_text(order_by)
        )
        query = select(Todo).filter(Todo.owner == owner).order_by(order)
        paginated_query, count_query = paginate_query(query, page, page_size)
        todos = (await self.session.execute(paginated_query)).scalars().all()
        count = (await self.session.execute(count_query)).scalar()
        return todos, count

    async def get_todos_by_project_id(
        self,
        project_id: UUID,
        *,
        order_by: TodoOrderByType = "created_on",
        order_direction: OrderDirectionType = "asc",
        page: int = 1,
        page_size: int = 10,
    ) -> Tuple[List[Todo], int]:
        order = (
            sa_text(f"{order_by} desc")
            if order_direction == "desc"
            else sa_text(order_by)
        )
        query = select(Todo).filter(Todo.project_id == project_id).order_by(order)
        paginated_query, count_query = paginate_query(query, page, page_size)
        todos = (await self.session.execute(paginated_query)).scalars().all()
        count = (await self.session.execute(count_query)).scalar()
        return todos, count

    async def get_todo_by_id(self, todo_id: UUID) -> Todo:
        result = await self.session.execute(select(Todo).filter(Todo.id == todo_id))
        return result.scalar()

    async def add_todo(self, todo: Dict) -> Todo:
        db_todo = Todo(**todo)
        self.session.add(db_todo)
        await self.session.commit()
        await self.session.refresh(db_todo)
        return db_todo

    async def update_todo(self, todo_id: UUID, update_values) -> Todo:
        q = update(Todo).where(Todo.id == todo_id).values(update_values)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()
        return await self.get_todo_by_id(todo_id)

    async def delete_todo_by_id(self, todo_id: UUID):
        q = delete(Todo).where(Todo.id == todo_id)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()


def get_todos_db(session: AsyncSession = Depends(get_db_session)) -> TodosDB:
    return TodosDB(session)
