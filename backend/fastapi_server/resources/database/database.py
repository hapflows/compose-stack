# This file includes and maps all apps databases spaces.

from typing import TypedDict

from fastapi_server.apps.feature_flags.database.postgres import (
    get_feature_flags_db,
    DB as FeatureFlagsDB,
)
from fastapi_server.apps.projects.database.postgres import get_projects_db, ProjectsDB
from fastapi_server.apps.users.database.postgres import get_user_db, DB as UsersDB


class Databases(TypedDict):
    feature_flags: FeatureFlagsDB
    projects: ProjectsDB
    users: UsersDB


def get_databases(db_session) -> Databases:
    feature_flags: FeatureFlagsDB = get_feature_flags_db(db_session)
    projects: ProjectsDB = get_projects_db(db_session)
    users: UsersDB = get_user_db(db_session)
    return {
        "feature_flags": feature_flags,
        "projects": projects,
        "users": users,
    }
