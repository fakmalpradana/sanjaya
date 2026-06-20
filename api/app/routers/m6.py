from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/datasets")
async def list_datasets(request: Request, _=Depends(get_current_user)):
    """Return the data catalogue entries available for import/export."""
    m6 = request.app.state.seed.get("m6_data", {})
    return m6.get("datasets", [])


@router.get("/connectors")
async def list_connectors(request: Request, _=Depends(get_current_user)):
    """Return configured data-source connectors (ERP, sensor streams, etc.)."""
    m6 = request.app.state.seed.get("m6_data", {})
    return m6.get("connectors", [])
