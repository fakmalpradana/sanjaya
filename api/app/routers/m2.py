from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/stockpiles")
async def list_stockpiles(request: Request, _=Depends(get_current_user)):
    """Return stockpile summaries — strip the heavy 'detail' payload for the list view."""
    raw: list[dict] = request.app.state.seed.get("m2_stockpiles", [])
    return [{k: v for k, v in item.items() if k != "detail"} for item in raw]


@router.get("/stockpiles/{stockpile_id}")
async def get_stockpile(stockpile_id: int, request: Request, _=Depends(get_current_user)):
    """Return a single stockpile with full detail by id."""
    raw: list[dict] = request.app.state.seed.get("m2_stockpiles", [])
    for item in raw:
        if item.get("id") == stockpile_id:
            return item
    raise HTTPException(status_code=404, detail="Stockpile not found")
