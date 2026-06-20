from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/slopes")
async def list_slopes(request: Request, _=Depends(get_current_user)):
    """Return slope stability monitoring zones and their current status."""
    return request.app.state.seed.get("m7_slopes", [])
