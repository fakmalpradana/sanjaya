from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from .jwt import create_access_token
from .rbac import get_current_user
from .users import HARDCODED_USERS

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(body: LoginRequest):
    """Validate hardcoded credentials and return a signed JWT."""
    user = HARDCODED_USERS.get(body.username)
    if not user or user["password"] != body.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": body.username, "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {k: v for k, v in user.items() if k != "password"},
    }


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return {k: v for k, v in current_user.items() if k != "password"}
