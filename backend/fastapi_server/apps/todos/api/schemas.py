from typing import Optional
from pydantic import BaseModel

from fastapi_server.apps.todos.schemas import TodoOrderByType
from fastapi_server.resources.database.postgres import OrderDirectionType


class TodoOrderParams(BaseModel):
    order_by: Optional[TodoOrderByType] = "created_on"
    order_direction: Optional[OrderDirectionType] = "asc"
