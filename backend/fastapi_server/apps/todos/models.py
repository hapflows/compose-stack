from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import UUID, Column, ForeignKey, String, DateTime

from fastapi_server.resources.database.postgres import Base
from fastapi_server.apps.core.models import AuditModelMixin


class Todo(AuditModelMixin, Base):
    __tablename__ = "todos"

    id: uuid.UUID = Column(
        UUID,
        default=lambda: str(uuid.uuid4().hex),
        primary_key=True,
        index=True,
        nullable=False,
        unique=True,
    )
    title: str = Column(String)
    description: str | None = Column(String, nullable=True)
    owner: str = Column(String)
    project_id: uuid.UUID = Column(UUID, ForeignKey("projects.id"), nullable=True)
    completed_on: Optional[datetime] = Column(DateTime, nullable=True)
    completed_by: Optional[str] = Column(String, nullable=True)
