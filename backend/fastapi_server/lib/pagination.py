from typing import Generic, List, TypeVar, Optional
from pydantic import BaseModel, conint


class PageParams(BaseModel):
    """These will be used as QueryParams"""

    page: Optional[conint(ge=1)] = 1
    page_size: Optional[conint(ge=5, le=100, multiple_of=5)] = 10


ItemType = TypeVar("ItemType")


class PaginatedResponse(BaseModel, Generic[ItemType]):
    """Response schema for any paged API."""

    total: int
    results: List[ItemType]
