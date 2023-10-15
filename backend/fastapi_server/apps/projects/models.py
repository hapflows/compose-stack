import uuid

from sqlalchemy import UUID, Boolean, Column, ForeignKey, String

from fastapi_server.resources.database.postgres import Base
from fastapi_server.apps.core.models import AuditModelMixin


class Project(AuditModelMixin, Base):
    __tablename__ = "projects"

    id: uuid.UUID = Column(
        UUID,
        default=lambda: str(uuid.uuid4().hex),
        primary_key=True,
        index=True,
        nullable=False,
        unique=True,
    )
    name: str = Column(String)
    description: str | None = Column(String, nullable=True)


class ProjectMember(AuditModelMixin, Base):
    __tablename__ = "project_members"

    project_id: uuid.UUID = Column(
        UUID,
        ForeignKey("projects.id"),
        primary_key=True,
        nullable=False,
    )
    user_id: str = Column(
        String,
        ForeignKey("users.id"),
        primary_key=True,
        nullable=False,
    )
    is_admin: bool = Column(Boolean, default=False)
