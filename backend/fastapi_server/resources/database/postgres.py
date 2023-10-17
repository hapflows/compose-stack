from typing import Literal

from fastapi import HTTPException
from sqlalchemy import func, Select, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker, declarative_base

from fastapi_server.config import get_settings

Base = declarative_base()


def get_db_url() -> str:
    settings = get_settings()
    return settings.postgres_url


def get_db_engine(database_url: str | None = None, **engine_kwargs) -> AsyncEngine:
    settings = get_settings()
    POSTGRES_URL = database_url or settings.postgres_url
    engine = create_async_engine(POSTGRES_URL, **engine_kwargs)
    return engine


def create_db_session(engine=None):
    if engine is None:
        engine = get_db_engine()
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    return async_session


async def get_db_session() -> AsyncSession:
    # async_session = session_async
    # if not async_session:
    engine = get_db_engine()
    async_session = create_db_session(engine)

    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except SQLAlchemyError as sql_ex:
            await session.rollback()
            raise sql_ex
        except HTTPException as http_ex:
            await session.rollback()
            raise http_ex
        finally:
            await session.close()
            await engine.dispose()


def paginate_query(query: Select, page: int, page_size: int):
    paginated_query = query.limit(page_size).offset((page - 1) * page_size)
    count_query = select(func.count()).select_from(query.subquery())
    return paginated_query, count_query


def print_statement(statement):
    try:
        print(statement.compile(compile_kwargs={"literal_binds": True}))
    except:
        print("Cannot apply literal binds to the statement. Printing raw:")
        print(statement)


OrderDirectionType = Literal["asc", "desc"]
