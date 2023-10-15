from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from fastapi.exceptions import HTTPException
from structlog import get_logger

from fastapi_server.lib.logs import exception_to_string
from fastapi_server.resources.database.postgres import get_db_session
from fastapi_server.resources.database.database import get_databases

from fastapi_server.apps.users.schemas import ActiveUser
from fastapi_server.apps.users.auth import with_active_user
from ..schemas import (
    ProjectMemberCreate,
    ProjectMemberRead,
    ProjectMemberUpdate,
    ProjectRead,
    ProjectCreate,
    ProjectUpdate,
)
from ..database.postgres import ProjectsDB, get_projects_db
from ..entitlements import project_with_permissions
from .. import core

from .schemas import CreateProjectMemberPayload, CreateProjectResponse

logger = get_logger("projects")

router = APIRouter(
    prefix="/projects", tags=["projects"], responses={404: {"description": "Not found"}}
)


@router.get(
    "/projects",
    name="projects:projects:get-projects",
    response_description="Get all Projects",
    response_model=List[ProjectRead],
)
async def get_projects(
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    projects = await db.get_projects()
    logger.info(
        "Get Projects",
        code="projects-get_projects",
        user_id=user.user_id,
        projects=len(projects),
    )
    return projects


@router.get(
    "/projects/user",
    name="projects:projects:get-user-projects",
    response_description="Get user Projects",
    response_model=List[ProjectRead],
)
async def get_user_projects(
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    projects = await db.get_projects_by_user(user.user_id)
    logger.info(
        "Get User Projects",
        code="projects-get_user_projects",
        user_id=user.user_id,
        projects=len(projects),
    )
    return projects


@router.post(
    "/projects",
    name="projects:projects:add-project",
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    project_create: ProjectCreate,
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
) -> CreateProjectResponse:
    created_project, created_project_member = await core.create_project(
        db, user.user_id, project_create
    )
    logger.info(
        "Create project",
        code="projects-create_project",
        user_id=user.user_id,
        project_id=str(created_project.id),
    )
    return {"project": created_project, "project_member": created_project_member}


@router.patch(
    "/projects/{project_id}",
    name="projects:projects:update-project",
    response_model=ProjectRead,
)
async def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    log_kwargs = {
        "code": "projects-update_project",
        "user_id": user.user_id,
        "project_id": str(project_id),
    }
    await project_with_permissions(db, project_id, user.user_id, True)
    try:
        updated_project = await core.update_project(
            db, user.user_id, project_id, project_update
        )
    except Exception as e:
        logger.error("Update project", exception=exception_to_string(e), **log_kwargs)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    logger.info("Update project", **log_kwargs)
    return updated_project


@router.delete(
    "/projects/{project_id}",
    name="projects:projects:delete-project",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_project(
    project_id: UUID,
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    log_kwargs = {
        "code": "projects-delete_project",
        "user_id": user.user_id,
        "project_id": str(project_id),
    }
    await project_with_permissions(db, project_id, user.user_id, True)
    try:
        await core.delete_project(db, project_id)
    except Exception as e:
        logger.error("Delete project", exception=str(e), **log_kwargs)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    logger.info("Delete project", **log_kwargs)

    return None


"""
PROJECT MEMBERS
"""


@router.get(
    "/projects/{project_id}/members",
    name="projects:project-members:get-project-members",
    response_description="Get Project Members",
    response_model=List[ProjectMemberRead],
)
async def get_project_members(
    project_id: UUID,
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    await project_with_permissions(db, project_id, user.user_id)
    project_members = await db.get_project_members_by_project_id(project_id)
    if not project_members:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return project_members


@router.post(
    "/projects/{project_id}/members",
    name="projects:project-members:create-project-member",
    response_description="Create Project Member",
    response_model=ProjectMemberRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_project_member(
    project_id: UUID,
    project_member_create_payload: CreateProjectMemberPayload,
    session=Depends(get_db_session),
    user: ActiveUser = Depends(with_active_user),
):
    dbs = get_databases(session)
    await project_with_permissions(dbs["projects"], project_id, user.user_id, True)
    try:
        user_to_add = await dbs["users"].get_user_by_email(
            project_member_create_payload.user_email
        )
        if not user_to_add:
            raise Exception()

        project_member_create = ProjectMemberCreate(
            project_id=project_id,
            user_id=user_to_add.id,
            is_admin=project_member_create_payload.is_admin,
        )
        project_member = await core.create_project_member(
            dbs["projects"], user.user_id, project_member_create
        )
    except Exception as e:
        logger.error(
            f"Create project member for project {project_id}",
            project_id=str(project_id),
            user_id=user.user_id,
            project_member_create_payload=project_member_create_payload.model_dump(),
            exception=exception_to_string(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return project_member


@router.patch(
    "/projects/{project_id}/members/{member_id}",
    name="projects:project-members:update-project-member",
    response_model=ProjectMemberRead,
)
async def update_project_member(
    project_id: UUID,
    member_id: str,
    project_member_update: ProjectMemberUpdate,
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    await project_with_permissions(db, project_id, user.user_id, True)

    try:
        updated_project_member = await core.update_project_member(
            db, user.user_id, project_id, member_id, project_member_update
        )
    except Exception as e:
        logger.error(
            f"Update project member {project_id}",
            project_id=project_id,
            user_id=user.user_id,
            member_id=member_id,
            project_member=project_member_update.model_dump(),
            exception=exception_to_string(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return updated_project_member


@router.delete(
    "/projects/{project_id}/members/{member_id}",
    name="projects:project-members:remove-project-member",
    response_description="Remove Project Member",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_project_member(
    project_id: UUID,
    member_id: str,
    db: ProjectsDB = Depends(get_projects_db),
    user: ActiveUser = Depends(with_active_user),
):
    await project_with_permissions(db, project_id, user.user_id, True)
    try:
        await db.delete_project_member_by_user_id(member_id)
    except Exception as e:
        logger.error(
            f"Delete project member for {project_id}",
            project_id=str(project_id),
            member_id=member_id,
            user_id=user.user_id,
            exception=exception_to_string(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return None
