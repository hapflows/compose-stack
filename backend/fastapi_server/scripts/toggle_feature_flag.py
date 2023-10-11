import sys

from fastapi_server.resources.database.postgres import (
    create_db_session,
    get_db_engine,
)
from fastapi_server.apps.feature_flags.database.postgres import get_feature_flags_db
from fastapi_server.lib.async_io import get_event_loop


async def toggle_feature_flag(feature_flag):
    async_session = create_db_session(get_db_engine())
    async with async_session() as session:
        db = get_feature_flags_db(session)
        ff = await db.get_feature_flag_by_codename(feature_flag)
        if not ff:
            raise Exception("Invalid FF selected, codename does not exist.")
        is_active = not ff.is_active
        await db.update_feature_flag(feature_flag, {"is_active": is_active})
        print(f"{feature_flag} new active status: {is_active}")
        await session.commit()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise Exception(
            "This command needs to be invoked with feature flag codename: `toggle_feature_flag.py FF_CODENAME`"
        )
    feature_flag = sys.argv[1]

    loop = get_event_loop()
    loop.run_until_complete(toggle_feature_flag(feature_flag))
