from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth.routes import router as auth_router
from .config import settings
from .routers import epochs, m1, m2, m3, m4, m5, m6, m7, m8
from .seed_loader import load_seed

app = FastAPI(title="SANJAYA WebGIS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    """Pre-load seed JSON files so routers never touch disk per request."""
    app.state.seed = load_seed(settings.SEED_DIR)


app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(epochs.router, prefix="/api/v1", tags=["epochs"])
app.include_router(m1.router, prefix="/api/v1/m1", tags=["M1"])
app.include_router(m2.router, prefix="/api/v1/m2", tags=["M2"])
app.include_router(m3.router, prefix="/api/v1/m3", tags=["M3"])
app.include_router(m4.router, prefix="/api/v1/m4", tags=["M4"])
app.include_router(m5.router, prefix="/api/v1/m5", tags=["M5"])
app.include_router(m6.router, prefix="/api/v1/m6", tags=["M6"])
app.include_router(m7.router, prefix="/api/v1/m7", tags=["M7"])
app.include_router(m8.router, prefix="/api/v1/m8", tags=["M8"])


@app.get("/health")
async def health():
    """Quick liveness check — also shows which seed keys were loaded."""
    return {"status": "ok", "seed_keys": list(app.state.seed.keys())}
