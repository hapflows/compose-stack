from typing import List, Tuple
from uuid import UUID

from fastapi import HTTPException, status

from .database.postgres import ProjectsDB
from .models import Project, ProjectMember


async def project_with_permissions(
    db: ProjectsDB, project_id: UUID, user_id: str, requires_admin: bool = False
) -> Tuple[Project, ProjectMember]:
    try:
        project = await db.get_project_by_id(project_id)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    project_member = await db.get_project_member_by_key(project_id, user_id)
    if not project_member:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    if requires_admin and not project_member.is_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return project, project_member
