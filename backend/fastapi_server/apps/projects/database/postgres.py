from typing import Dict, List
from uuid import UUID

from fastapi import Depends
from sqlalchemy import update, delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

from fastapi_server.resources.database.postgres import get_db_engine, get_db_session
from ..models import Project, ProjectMember


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_db_engine())


class ProjectsDB:
    session: Session

    def __init__(self, session: Session):
        self.session = session

    """
    PROJECTS
    """

    async def get_projects(self) -> List[Project]:
        result = await self.session.execute(select(Project))
        return result.scalars().all()

    async def get_projects_by_user(self, user_id: str) -> List[Project]:
        result = await self.session.execute(
            select(Project)
            .join(ProjectMember, ProjectMember.project_id == Project.id)
            .filter(ProjectMember.user_id == user_id)
        )
        return result.scalars().all()

    async def get_project_by_id(self, project_id: UUID) -> Project:
        result = await self.session.execute(
            select(Project).filter(Project.id == project_id)
        )
        return result.scalar()

    async def add_project(self, project: Dict) -> Project:
        db_project = Project(**project)
        self.session.add(db_project)
        await self.session.commit()
        await self.session.refresh(db_project)
        return db_project

    async def update_project(self, project_id: UUID, update_values) -> Project:
        q = update(Project).where(Project.id == project_id).values(update_values)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()
        return await self.get_project_by_id(project_id)

    async def delete_project_by_id(self, project_id: UUID):
        q = delete(Project).where(Project.id == project_id)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()

    """
    PROJECT MEMBERS
    """

    async def add_project_member(
        self,
        project_member: Dict,
    ) -> ProjectMember:
        db_project_member = ProjectMember(**project_member)
        self.session.add(db_project_member)
        await self.session.commit()
        await self.session.refresh(db_project_member)
        return db_project_member

    async def get_project_members_by_user_id(self, user_id: str) -> List[ProjectMember]:
        q = select(ProjectMember).filter(ProjectMember.user_id == user_id)
        result = await self.session.execute(q)
        return result.scalars().all()

    async def get_project_members_by_project_id(
        self, project_id: UUID
    ) -> List[ProjectMember]:
        q = select(ProjectMember).filter(ProjectMember.project_id == project_id)
        result = await self.session.execute(q)
        return result.scalars().all()

    async def get_project_member_by_key(
        self, project_id: UUID, user_id: str
    ) -> ProjectMember:
        q = select(ProjectMember).filter(
            ProjectMember.project_id == project_id, ProjectMember.user_id == user_id
        )
        result = await self.session.execute(q)
        return result.scalar()

    async def update_project_member(
        self, project_id: UUID, member_id: str, update_values
    ) -> ProjectMember:
        q = (
            update(ProjectMember)
            .where(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == member_id,
            )
            .values(update_values)
        )
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()
        return await self.get_project_member_by_key(project_id, member_id)

    async def delete_project_members_by_project_id(self, project_id: UUID):
        q = delete(ProjectMember).where(ProjectMember.project_id == project_id)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()

    async def delete_project_member_by_user_id(self, project_id: UUID, user_id: str):
        q = delete(ProjectMember).where(
            ProjectMember.project_id == project_id, ProjectMember.user_id == user_id
        )
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()

    async def delete_project_members_by_user_id(self, user_id: str):
        q = delete(ProjectMember).where(ProjectMember.user_id == user_id)
        q.execution_options(synchronize_session="fetch")
        await self.session.execute(q)
        await self.session.commit()


def get_projects_db(session: AsyncSession = Depends(get_db_session)) -> ProjectsDB:
    return ProjectsDB(session)
