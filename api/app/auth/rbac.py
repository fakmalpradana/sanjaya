from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .jwt import decode_token
from .users import HARDCODED_USERS

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Resolve Bearer token to a user dict; raise 401 if token is invalid or user unknown."""
    payload = decode_token(credentials.credentials)
    username = payload.get("sub")
    if not username or username not in HARDCODED_USERS:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return HARDCODED_USERS[username]


def require_role(*roles: str):
    """Factory for role-guard dependencies — use on write endpoints."""
    def _dep(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return user
    return _dep
