from uuid import UUID

from fastapi import HTTPException, status

from fastapi_server.resources.database.database import Databases


async def todo_with_permissions(
    dbs: Databases,
    todo_id: UUID,
    user_id: str,
    requires_admin: bool = False,
):
    try:
        todo = await dbs["todos"].get_todo_by_id(todo_id)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if todo.owner == user_id:
        return todo, None

    project_member = await dbs["projects"].get_project_member_by_key(
        todo.project_id, user_id
    )
    if not project_member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if requires_admin and not project_member.is_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return todo, project_member
