from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ProjectRead(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    created_by: str
    created_on: datetime
    updated_by: Optional[str]
    updated_on: Optional[datetime]


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ProjectMemberRead(BaseModel):
    project_id: UUID
    user_id: str
    is_admin: bool


class ProjectMemberCreate(BaseModel):
    project_id: UUID
    user_id: str
    is_admin: bool


class ProjectMemberUpdate(BaseModel):
    is_admin: Optional[bool]
