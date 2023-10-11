from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from .core import validate_access_token
from .schemas import ActiveUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


async def with_active_user(token: str = Depends(oauth2_scheme)) -> ActiveUser:
    try:
        user_data = await validate_access_token(token)
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return ActiveUser(**user_data)
