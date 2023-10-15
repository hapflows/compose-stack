from datetime import datetime
from typing import Tuple
from uuid import UUID

from .database.postgres import ProjectsDB
from .models import Project, ProjectMember
from .schemas import (
    ProjectCreate,
    ProjectMemberCreate,
    ProjectMemberUpdate,
    ProjectUpdate,
)


async def create_project(
    db: ProjectsDB, user_id: str, project: ProjectCreate
) -> Tuple[Project, ProjectMember]:
    # Create the Project
    project_dict = project.model_dump(exclude_unset=True)
    project_dict["created_by"] = user_id
    project_dict["updated_by"] = user_id
    created_project = await db.add_project(project_dict)
    # Add the user as admin
    project_member_dict = {
        "project_id": created_project.id,
        "user_id": user_id,
        "is_admin": True,
        "created_by": user_id,
        "updated_by": user_id,
    }
    created_member = await db.add_project_member(project_member_dict)
    return (created_project, created_member)


async def update_project(
    db: ProjectsDB,
    user_id: str,
    project_id: UUID,
    project: ProjectUpdate,
) -> Project:
    update_data = project.model_dump(exclude_unset=True)
    update_data["updated_by"] = user_id
    update_data["updated_on"] = datetime.now()
    updated_todo = await db.update_project(project_id, update_data)
    return updated_todo


async def delete_project(db: ProjectsDB, project_id: UUID) -> Project:
    project = await db.get_project_by_id(project_id)
    await db.delete_project_members_by_project_id(project_id)
    await db.delete_project_by_id(project_id)
    return project


async def create_project_member(
    db: ProjectsDB, user_id: str, project_member: ProjectMemberCreate
) -> ProjectMember:
    # Get the user
    project_member_dict = project_member.model_dump(exclude_unset=True)
    project_member_dict["created_by"] = user_id
    project_member_dict["updated_by"] = user_id
    created_member = await db.add_project_member(project_member_dict)
    return created_member


async def update_project_member(
    db: ProjectsDB,
    user_id: str,
    project_id: UUID,
    project_member_id: str,
    project_member: ProjectMemberUpdate,
) -> ProjectMember:
    update_data = project_member.model_dump(exclude_unset=True)
    update_data["updated_by"] = user_id
    update_data["updated_on"] = datetime.now()
    updated_project_member = await db.update_project_member(
        project_id, project_member_id, update_data
    )
    return updated_project_member
