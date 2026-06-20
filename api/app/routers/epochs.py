from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/epochs")
async def list_epochs(request: Request, _=Depends(get_current_user)):
    """Return all survey epochs available for time-slider navigation."""
    return request.app.state.seed.get("epochs", [])
