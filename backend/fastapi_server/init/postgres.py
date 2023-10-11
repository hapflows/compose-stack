import os
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError, DBAPIError

from fastapi_server.resources.database.postgres import get_db_engine


async def bootstrap():
    print("Bootstrap Postgres")

    POSTGRES_URL = os.getenv("POSTGRES_URL").replace(
        f"/{os.getenv('POSTGRES_DATABASE')}", "/postgres"
    )
    engine = get_db_engine(POSTGRES_URL, isolation_level="AUTOCOMMIT")

    async with engine.begin() as conn:
        try:
            query = f"CREATE DATABASE {os.getenv('POSTGRES_DATABASE')} WITH OWNER {os.getenv('POSTGRES_USER')}"
            print(f"Run {query=}")
            await conn.execute(text(query))
        except ProgrammingError as e:
            if "DuplicateDatabaseError" in str(e):
                print("\tDatabase already exists.")
            else:
                raise e

    print("postgres bootstrap done!")


async def destroy():
    print("Destroy Postgres")

    POSTGRES_URL = os.getenv("POSTGRES_URL").replace(
        f"/{os.getenv('POSTGRES_DATABASE')}", "/postgres"
    )
    print(f"Connect to {POSTGRES_URL=}")
    engine = get_db_engine(POSTGRES_URL, isolation_level="AUTOCOMMIT")

    async with engine.begin() as conn:
        try:
            query = f"DROP DATABASE {os.getenv('POSTGRES_DATABASE')}"
            print(f"Run {query=}")
            await conn.execute(text(query))
        except DBAPIError as e:
            print("Database doesn't exists.")
    print("postgres destroy done!")
