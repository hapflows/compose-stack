from sqlalchemy import Column, String, Boolean

from fastapi_server.resources.database.postgres import Base
from fastapi_server.apps.core.models import AuditModelMixin


class FeatureFlag(AuditModelMixin, Base):
    __tablename__ = "feature_flags"

    codename: str = Column(String, primary_key=True)
    label: str | None = Column(String, nullable=True)
    description: str | None = Column(String, nullable=True)
    is_active: bool = Column(Boolean, default=False)
