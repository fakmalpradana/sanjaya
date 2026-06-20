from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/pit-designs")
async def list_pit_designs(request: Request, _=Depends(get_current_user)):
    """Return all pit design records for the mine-plan comparison panel."""
    pit = request.app.state.seed.get("m3_pit", {})
    return pit.get("designs", [])


@router.get("/pit-designs/{design_id}")
async def get_pit_design(design_id: int, request: Request, _=Depends(get_current_user)):
    """Return a single pit design by id."""
    pit = request.app.state.seed.get("m3_pit", {})
    for item in pit.get("designs", []):
        if item.get("id") == design_id:
            return item
    raise HTTPException(status_code=404, detail="Pit design not found")
