# SANJAYA WebGIS

**Spatial Analytics & Network Integration for Joint Coal-mining Operation**

A unified WebGIS platform for coal-mining operations — from 3D point cloud visualization and epoch-based volumetric analysis to real-time fleet monitoring and land permit management.

![SANJAYA Architecture](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20PostGIS%20%7C%20CesiumJS-FFD23F?style=flat-square&labelColor=141414)
![Phase](https://img.shields.io/badge/Phase-0%20%E2%80%94%20Foundation-52B788?style=flat-square&labelColor=141414)
![License](https://img.shields.io/badge/License-MIT-4A9EFF?style=flat-square&labelColor=141414)

---

## Overview

SANJAYA addresses the **"information islands"** problem in coal-mining operations — where survey data, hauling data, geotechnical data, and permit data live in isolated systems, slowing down operational decisions.

The platform provides a **single source of truth** accessible from any browser, with multi-temporal (epoch-based) spatial data at its core.

### 8 Operational Modules

| Module | Function |
|--------|----------|
| **M1 — Visualisasi 2D/3D** | Interactive 2D map + 3D globe with point cloud streaming (3D Tiles), time slider, layer control |
| **M2 — Stockpile & Volumetrik** | Per-epoch volume calculation, cut-fill analysis, anomaly detection, export CSV/DXF/PDF |
| **M3 — Pit Design** | Mine plan import (DXF/LandXML), design-to-actual overlay, cross-section tool |
| **M4 — Armada & BBM** | Real-time fleet tracking, fuel estimation, geofencing, cycle time & efficiency analysis |
| **M5 — Dashboard & DSS** | Executive KPI dashboard, multi-module early warning, AI/rule-based recommendation engine |
| **M6 — Data Hub** | OGC-standard data catalog, ETL connectors (WebODM, DJI Terra, MQTT, ATR-BPN) |
| **M7 — Geoteknik** | Slope stability monitoring (FK/PK), overburden dump tracking, compliance reporting |
| **M8 — Pertanahan & Perizinan** | Land acquisition pipeline (kanban), PPKH/IPPKH permit tracking, spatial conflict detection |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript, TanStack Query, Zustand |
| **3D Map** | CesiumJS (3D Tiles, terrain) + MapLibre GL (2D) |
| **Backend** | FastAPI (Python), JWT auth, 9-role RBAC |
| **Spatial DB** | PostgreSQL 16 + PostGIS 3.4 |
| **Time-series** | TimescaleDB (fleet telemetry) |
| **Object Store** | MinIO (LAZ, GeoTIFF, 3D Tiles — S3-compatible) |
| **Geospatial API** | pygeoapi (OGC API Features) + GeoServer (WMS/WMTS, Phase 1+) |
| **Async Processing** | Celery + Redis (volumetric calc, 3D tiling — Phase 1+) |
| **IoT/Fleet** | Mosquitto MQTT broker |
| **Infrastructure** | Docker Compose (portable to on-prem / air-gapped environments) |

---

## Quick Start

### Prerequisites
- Docker + Docker Compose v2
- 4 GB RAM minimum (8 GB recommended)

### Run

```bash
git clone https://github.com/fakmalpradana/sanjaya.git
cd sanjaya

# Configure environment
cp .env.example .env

# Start all Phase 0 services
docker compose up -d

# Wait for services to be healthy (~30 seconds)
docker compose ps
```

**Access:**
| Service | URL | Notes |
|---------|-----|-------|
| Web App | http://localhost:3000 | Main SANJAYA interface |
| API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Interactive Swagger UI |
| MinIO Console | http://localhost:9001 | Object store admin |
| OGC API | http://localhost:5000 | pygeoapi endpoint |

### Demo Login

Any username/password works when the backend is offline (demo mode). When backend is running:

| Username | Password | Role |
|----------|----------|------|
| `owner` | `owner` | Pemilik Tambang (full read) |
| `ktt` | `ktt` | Kepala Teknik Tambang |
| `surveyor` | `surveyor` | Surveyor (M1, M2 write) |
| `dispatcher` | `dispatcher` | Dispatcher / Operasi (M4) |
| `geotech` | `geotech` | Geotech Engineer (M7) |
| `land` | `land` | Tim Pembebasan Lahan (M8) |
| `auditor` | `auditor` | Inspektur / Auditor (read-only) |

---

## Development Setup

### Backend (FastAPI — hot reload)

```bash
# Start infrastructure only
docker compose up -d postgis redis minio mqtt

# Install and run backend
cd api
pip install -r requirements.txt
SEED_DIR=../seed/data uvicorn app.main:app --reload
# → http://localhost:8000/docs
```

### Frontend (React + Vite)

```bash
cd web
npm install
npm run dev
# → http://localhost:5173
```

Set `VITE_API_BASE=http://localhost:8000/api/v1` in `web/.env` (copy from `.env.example`).

---

## Architecture

```
Browser / PWA
     │
     ▼ HTTPS
  Traefik proxy (Phase 1+)
     │
     ├── /        → web (React, served via Nginx or Vercel)
     ├── /api/v1  → api (FastAPI)
     ├── /ogc     → geo-api (pygeoapi — OGC API Features)
     └── /tiles   → minio (3D Tiles, LAZ, GeoTIFF)

Data layer:
  PostGIS  — vector + temporal (epochs, polygons, attributes)
  TimescaleDB — fleet time-series (trails, telemetry, fuel)
  MinIO    — object store (large files: LAZ, ortho, 3D Tiles)
  Redis    — Celery broker + query cache

Heavy services (--profile full):
  GeoServer  — WMS/WMTS raster rendering
  worker     — Celery: volumetric calc, 3D tiling
  fleet-ingest — MQTT consumer → TimescaleDB
```

**Deployment model:** Frontend deploys to Vercel (static). Backend + data runs on a server via Docker Compose — portable to on-premises / air-gapped environments (regulatory requirement for sensitive mining data).

---

## Project Structure

```
sanjaya/
├── docker-compose.yml          # All 13 services
├── docker-compose.override.yml # Dev hot-reload overrides
├── .env.example                # Environment template
├── config/
│   ├── mosquitto.conf          # MQTT broker
│   └── pygeoapi.yml            # OGC API config
├── api/                        # FastAPI backend
│   └── app/
│       ├── auth/               # JWT + RBAC (9 roles)
│       └── routers/            # M1–M8 + epochs
├── web/                        # React + Vite frontend
│   └── src/
│       ├── modules/            # M1–M8 screens
│       ├── map/                # Cesium + MapLibre wrappers
│       └── components/         # Topbar, ModuleRail, UI kit
└── seed/data/                  # Mock JSON data (Phase 0)
```

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **0 — Foundation** | All 8 modules navigable with mock data, auth/RBAC, full Docker stack | ✅ Done |
| **1 — M1 + M6** | Real 3D Tiles pipeline (PDAL → py3dtiles), OGC API with PostGIS data | 🔲 Next |
| **2 — M2** | Real volumetric calculation (rasterio/PDAL), cut-fill, export | 🔲 Planned |
| **3 — M3, M7, M8** | DXF/LandXML parser, geotechnics ingest, ATR-BPN land data | 🔲 Planned |
| **4 — M4** | MQTT fleet ingest → TimescaleDB, fuel estimation model | 🔲 Planned |
| **5 — M5** | Cross-module analytics, rule engine, AI/ML recommendations | 🔲 Planned |

---

## Contributing

Issues and PRs welcome. For major features, open an issue first to discuss scope.

Coding conventions:
- Backend: black + ruff formatting, type hints on all functions
- Frontend: strict TypeScript, inline styles for visual (Tailwind for layout only)

---

## License

MIT — see [LICENSE](LICENSE).

---

*Built for the Indonesian coal-mining industry. Open-source to promote best practices in spatial data management for mining operations.*
