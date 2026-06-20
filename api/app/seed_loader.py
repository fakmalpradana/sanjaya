from __future__ import annotations

import json
from pathlib import Path


def load_seed(seed_dir: str) -> dict:
    """Load every JSON file in seed_dir at startup so routers can read them from app.state."""
    data = {}
    p = Path(seed_dir)
    if not p.exists():
        return data
    for f in p.glob("*.json"):
        data[f.stem] = json.loads(f.read_text(encoding="utf-8"))
    return data
