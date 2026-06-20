from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/units")
async def list_units(request: Request, _=Depends(get_current_user)):
    """Return fleet unit positions and status for the live dispatch map."""
    return request.app.state.seed.get("m4_units", [])


@router.get("/fleet/kpi")
async def fleet_kpi(request: Request, _=Depends(get_current_user)):
    """Return aggregated fleet KPI figures for the M4 dashboard cards."""
    return request.app.state.seed.get("m4_fleet_kpi", {})
