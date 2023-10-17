from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel


class TodoRead(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    owner: str
    project_id: Optional[UUID]
    completed_on: Optional[datetime]
    created_by: str
    created_on: datetime
    updated_by: Optional[str]
    updated_on: Optional[datetime]
    completed_by: Optional[str]
    completed_on: Optional[datetime]


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[UUID] = None


class TodoUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str] = None


class TodoToggleUpdate(BaseModel):
    completed_on: Optional[datetime] = None
    completed_by: Optional[str] = None


TodoOrderByType = Literal["created_on", "title"]
