from pydantic import BaseModel


class FeatureFlagRead(BaseModel):
    codename: str
    label: str
    description: str
    is_active: bool
