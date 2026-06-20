from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


def _land(request: Request) -> dict:
    """Helper: pull the m8_land seed block once."""
    return request.app.state.seed.get("m8_land", {})


@router.get("/land/dashboard")
async def land_dashboard(request: Request, _=Depends(get_current_user)):
    """Return the full M8 land-acquisition dashboard object."""
    return _land(request)


@router.get("/parcels")
async def list_parcels(request: Request, _=Depends(get_current_user)):
    """Flatten parcel_cols into a single list for the land-parcel data grid."""
    land = _land(request)
    cols: dict = land.get("parcel_cols", {})
    # parcel_cols is expected to be a dict of column-name → list; flatten to list of dicts
    if isinstance(cols, dict):
        keys = list(cols.keys())
        if not keys:
            return []
        length = len(cols[keys[0]])
        return [{k: cols[k][i] for k in keys} for i in range(length)]
    # Fallback: if it's already a list, return as-is
    return cols if isinstance(cols, list) else []


@router.get("/permits")
async def list_permits(request: Request, _=Depends(get_current_user)):
    """Return mining permit records and their expiry status."""
    return _land(request).get("permits", [])


@router.get("/conflicts")
async def list_conflicts(request: Request, _=Depends(get_current_user)):
    """Return land-conflict cases flagged for resolution."""
    return _land(request).get("conflicts", [])
