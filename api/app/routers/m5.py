from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..auth.rbac import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def dashboard(request: Request, _=Depends(get_current_user)):
    """Return the M5 environment monitoring dashboard summary."""
    return request.app.state.seed.get("m5_dashboard", {})


@router.get("/alerts")
async def alerts(request: Request, _=Depends(get_current_user)):
    """Return active environmental alerts for the notification panel."""
    return request.app.state.seed.get("m5_alerts", [])


@router.get("/recommendations")
async def recommendations(request: Request, _=Depends(get_current_user)):
    """Return AI-generated environmental recommendations."""
    return request.app.state.seed.get("m5_recommendations", [])
