from typing import Dict, List

from fastapi import Depends
from sqlalchemy import func, update, delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

from fastapi_server.resources.database.postgres import get_db_engine, get_db_session
from ..models import User


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_db_engine())


class DB:
    session: Session

    def __init__(self, session: Session):
        self.session = session

    async def count_users(self):
        result = await self.session.execute(func.count(User.id))
        return result.scalar()

    async def get_users(self, skip: int = 0, limit: int = 100):
        result = await self.session.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_user_by_email(self, email: str) -> User:
        result = await self.session.execute(select(User).filter(User.email == email))
        return result.scalar()

    async def get_user_by_id(self, user_id: str) -> User:
        result = await self.session.execute(select(User).filter(User.id == user_id))
        return result.scalar()

    async def get_users_by_id(self, users_ids: List[str]):
        result = await self.session.execute(select(User).filter(User.id.in_(users_ids)))
        return result.scalars().all()

    async def get_users_by_identity(self, identity: str):
        result = await self.session.execute(
            select(User).filter(User.identity == identity)
        )
        return result.scalars().all()

    async def add_user(self, user, is_active: bool = True) -> User:
        db_user = User(
            id=user["id"],
            email=user["email"],
            hashed_password=user["hashed_password"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            is_active=is_active,
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def update_user(
        self, user_id: str, update_values: Dict[str, any], return_user: bool = True
    ):
        q = update(User).where(User.id == user_id).values(update_values)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()
        if return_user:
            return await self.get_user_by_id(user_id)
        else:
            return True

    async def delete_user(self, user_id: str):
        raise NotImplemented("Not implemented yet")


def get_user_db(session: AsyncSession = Depends(get_db_session)) -> DB:
    return DB(session)
