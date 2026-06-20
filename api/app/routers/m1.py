from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/layers")
async def list_layers(request: Request, _=Depends(get_current_user)):
    """Return the map layer catalogue used by the M1 base-map panel."""
    return request.app.state.seed.get("m1_layers", [])


@router.get("/datasets")
async def list_datasets(request: Request, _=Depends(get_current_user)):
    """Reuse the M6 dataset list so M1 can reference available raster/vector sources."""
    m6 = request.app.state.seed.get("m6_data", {})
    return m6.get("datasets", [])
