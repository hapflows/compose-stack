from datetime import datetime

from sqlalchemy import Column, String, Boolean, Integer, DateTime

from fastapi_server.resources.database.postgres import Base
from fastapi_server.apps.core.models import AuditModelMixin


class User(AuditModelMixin, Base):
    __tablename__ = "users"

    id: str = Column(String, primary_key=True)
    email: str = Column(String)
    hashed_password: str = Column(String)
    first_name: str = Column(String)
    last_name: str = Column(String)
    is_active: bool = Column(Boolean, default=False)
    is_superuser: bool = Column(Boolean, default=False)
    is_verified: bool = Column(Boolean, default=False)
    login_failed_count: int = Column(Integer, default=0)
    last_login: datetime | None = Column(DateTime, nullable=True)
    verified_on: datetime | None = Column(DateTime, nullable=True)
    deactivated_on: datetime | None = Column(DateTime, nullable=True)
