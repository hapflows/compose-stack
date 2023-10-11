from sqlalchemy import Column, DateTime, func, String


class AuditModelMixin(object):
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    updated_on = Column(DateTime(timezone=True), onupdate=func.now())


def clear_audit_fields(instance: dict):
    del instance["created_by"]
    del instance["created_on"]
    del instance["updated_by"]
    del instance["updated_on"]
    return instance
