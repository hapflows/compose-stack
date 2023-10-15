from pydantic import BaseModel, ConfigDict

from fastapi_server.apps.projects.schemas import ProjectMemberRead, ProjectRead


class CreateProjectResponse(BaseModel):
    project: ProjectRead
    project_member: ProjectMemberRead


class CreateProjectMemberPayload(BaseModel):
    user_email: str
    is_admin: bool
