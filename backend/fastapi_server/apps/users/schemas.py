from typing import Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str


class UserRead(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str


class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]


class UserTokens(BaseModel):
    id: str
    email: str
    first_name: str


class UserPasswordReset(BaseModel):
    email: str
    token: str
    password: str


class ActiveUser(BaseModel):
    user_id: str
    email: str
    first_name: str


class RegistrationTokenCode(BaseModel):
    token: str
    registration_code: str
