import sys

from fastapi_server.resources.database.postgres import (
    create_db_session,
    get_db_engine,
)
from fastapi_server.apps.users.database.postgres import get_user_db
from fastapi_server.lib.async_io import get_event_loop
from fastapi_server.apps.users.core import activate_user


async def force_activate_user(user_email):
    async_session = create_db_session(get_db_engine())
    async with async_session() as session:
        db = get_user_db(session)
        await activate_user(db, user_email)
        await session.commit()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise Exception(
            "This command needs to be invoked with user email: `activate_user.py name@domain.com`"
        )
    user_email = sys.argv[1]

    loop = get_event_loop()
    loop.run_until_complete(force_activate_user(user_email))
