import os

from fastapi_server.apps.users.schemas import ActiveUser

NEW_RELIC = os.getenv("NEW_RELIC")
ENVIRONMENT = os.getenv("ENVIRONMENT")
if NEW_RELIC == "1":
    import newrelic.agent

    newrelic.agent.initialize(
        "newrelic.ini",
        environment=ENVIRONMENT or "staging",
    )

from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from fastapi_server.apps.core import logger
from fastapi_server.apps.users.api import api as users_api
from fastapi_server.apps.users.auth import with_active_user
from fastapi_server.apps.feature_flags.api import api as feature_flags_api
from fastapi_server.apps.projects.api import api as projects_api

cors_origins = os.getenv("CORS_ORIGINS", "").split(";")

prefix_router = APIRouter()

# On dev, the app is served at / , in prod is served at /api2
# (we don't use /api because it's a reserved path from Next JS)
root_path = "/api2" if ENVIRONMENT != "dev" else None
app = FastAPI(
    root_path=root_path,
)

app.mount("/mediafiles", StaticFiles(directory="mediafiles"), name="mediafiles")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix_router.include_router(users_api.router)
prefix_router.include_router(feature_flags_api.router)
prefix_router.include_router(projects_api.router)


@prefix_router.get("/_authenticated")
async def authenticated_route(user: ActiveUser = Depends(with_active_user)):
    return {"message": f"Hello {user.first_name}!"}


@prefix_router.get("/_status")
async def status():
    return {
        "status": "running",
    }


app.include_router(prefix_router, prefix=os.getenv("APP_PREFIX", ""))
