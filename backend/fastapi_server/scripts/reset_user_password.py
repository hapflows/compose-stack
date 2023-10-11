import sys

from fastapi_server.resources.database.postgres import (
    create_db_session,
    get_db_engine,
)
from fastapi_server.apps.users.database.postgres import get_user_db
from fastapi_server.lib.async_io import get_event_loop
from fastapi_server.apps.users.core import activate_user, change_user_password


async def force_reset_user_password(user_email, new_password):
    async_session = create_db_session(get_db_engine())
    async with async_session() as session:
        db = get_user_db(session)
        user = await db.get_user_by_email(user_email)
        await change_user_password(db, user, new_password)
        await activate_user(db, user_email)
        await session.commit()


if __name__ == "__main__":
    # TODO: send an email instead with the temporary password
    if len(sys.argv) < 3:
        raise Exception(
            "This command needs to be invoked with user email and password: `reset_user_password.py name@domain.com newPassword`"
        )
    user_email = sys.argv[1]
    new_password = sys.argv[2]

    loop = get_event_loop()
    loop.run_until_complete(force_reset_user_password(user_email, new_password))
