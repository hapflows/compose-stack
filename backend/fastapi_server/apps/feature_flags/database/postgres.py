from typing import Dict, List

from fastapi import Depends
from sqlalchemy import update, delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from fastapi_server.resources.database.postgres import get_db_session
from ..models import FeatureFlag


class DB:
    session: Session

    def __init__(self, session: Session):
        self.session = session

    async def get_feature_flags(self) -> List[FeatureFlag]:
        result = await self.session.execute(select(FeatureFlag))
        return result.scalars().all()

    async def get_feature_flag_by_codename(self, codename: str) -> FeatureFlag:
        result = await self.session.execute(
            select(FeatureFlag).filter(FeatureFlag.codename == codename)
        )
        return result.scalar()

    async def add_feature_flag(self, feature_flag: Dict) -> FeatureFlag:
        db_feature_flag = FeatureFlag(**feature_flag)
        self.session.add(db_feature_flag)
        await self.session.commit()
        await self.session.refresh(db_feature_flag)
        return db_feature_flag

    async def update_feature_flag(self, codename: str, update_values) -> FeatureFlag:
        q = (
            update(FeatureFlag)
            .where(FeatureFlag.codename == codename)
            .values(update_values)
        )
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()
        return await self.get_feature_flag_by_codename(codename)

    async def delete_feature_flag(self, codename: str):
        q = delete(FeatureFlag).where(FeatureFlag.codename == codename)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()


def get_feature_flags_db(session: AsyncSession = Depends(get_db_session)) -> DB:
    return DB(session)
