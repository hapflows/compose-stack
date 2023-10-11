from fastapi import APIRouter, Depends

from fastapi_server.apps.feature_flags.database.postgres import DB, get_feature_flags_db

router = APIRouter(
    prefix="/feature-flags",
    tags=["feature-flags"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_description="Get all feature flags")
async def get_feature_flags(db: DB = Depends(get_feature_flags_db)):
    feature_flags = await db.get_feature_flags()
    return feature_flags
