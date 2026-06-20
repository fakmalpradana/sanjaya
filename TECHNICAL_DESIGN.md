# SANJAYA — Dokumen Desain Teknis

**Spatial Analytics & Network Integration for Joint Coal-mining Operation**

| | |
|---|---|
| Versi | 0.1 (draft implementasi) |
| Tanggal | 2026-06-20 |
| Acuan | SRS WebGIS Tambang Batu Bara v1.0 |
| Skema dev | **B — Service-Oriented penuh** |
| Deploy | **Hybrid**: Frontend di Vercel · Backend + data di server (Docker Compose, portable ke on-prem/air-gapped) |
| Strategi data | **Mock-first**: kontrak API dibekukan dari awal, sumber data berevolusi dari seed → real |

---

## 1. Prinsip arsitektur

Empat aturan yang mengikat semua keputusan di bawah:

1. **Open-standard-first.** OGC (WMS/WMTS/WFS/OGC API Features), 3D Tiles, LAS/LAZ, GeoTIFF. Tidak ada format/vendor yang mengunci data.
2. **On-prem mungkin.** Seluruh backend hidup di Docker Compose. Tidak ada dependensi wajib ke layanan cloud berbayar di sisi data. Vercel hanya meng-host frontend statis.
3. **Epoch = warga kelas satu.** Setiap data spasial berversi terhadap `epoch` (titik waktu survei). Time-slider dan perbandingan antar-epoch bukan fitur tambahan, tapi struktur inti tabel.
4. **Kontrak stabil, data berevolusi.** Frontend bicara ke kontrak API yang sama baik datanya dari `seed/` (mock) maupun dari hitungan asli. Mengisi modul = mengganti implementasi service, bukan mengubah API.

---

## 2. Peta service (Skema B)

Setiap kotak = satu container di `docker-compose.yml`. Kolom **Status awal** menandai mana yang aktif penuh vs di-stub dengan mock saat mulai.

| # | Service | Teknologi | Tanggung jawab | Status awal |
|---|---|---|---|---|
| 1 | `web` | React + Vite + TS | UI 8 modul (deploy ke Vercel) | Aktif (mock data) |
| 2 | `proxy` | Traefik | Reverse proxy, TLS, routing `/api`, `/ogc`, `/tiles` | Aktif |
| 3 | `api-core` | FastAPI | Auth/RBAC, CRUD, M5/M6/M8, orkestrasi job | Aktif (mock) |
| 4 | `geo-api` | pygeoapi | OGC API Features (vektor PostGIS → GeoJSON) | Aktif |
| 5 | `geoserver` | GeoServer | WMS/WMTS/WFS raster & basemap berat | Stub (Fase lanjut) |
| 6 | `worker` | Celery | Volumetrik (M2), diff design-to-actual (M3), analitik | Stub → aktif Fase 2 |
| 7 | `tiler` | PDAL + py3dtiles | LAS/LAZ → 3D Tiles, terrain quantized-mesh | Stub → aktif Fase 1+ |
| 8 | `fleet-ingest` | Python + paho-mqtt | Konsumsi telemetri MQTT → TimescaleDB | Stub (mock WS) |
| 9 | `mqtt` | Mosquitto | Broker telemetri armada (M4) | Aktif (seed publisher) |
| 10 | `postgis` | PostgreSQL 16 + PostGIS 3 | Data vektor + temporal (semua modul) | Aktif |
| 11 | `timescale` | TimescaleDB | Time-series armada/BBM (M4) | Aktif (seed) |
| 12 | `redis` | Redis | Broker Celery + cache query | Aktif |
| 13 | `minio` | MinIO (S3 API) | Objek besar: LAZ, ortofoto, 3D Tiles, dokumen M8 | Aktif |

> **Stub** = service ada di Compose dan endpoint-nya hidup, tapi mengembalikan/menyajikan data dari `seed/`. Mengaktifkan = mengganti isi handler dengan proses asli. Frontend tidak berubah.

### Alur data inti

```
Drone/LiDAR  ──upload──▶ api-core ──▶ MinIO (raw LAZ/ortho)
                                  └──▶ Celery worker ──▶ tiler ──▶ MinIO (3D Tiles) ──▶ web (Cesium)
                                                       └──▶ PostGIS (volume, toe polygon, hasil)
Telematik    ──MQTT──▶ fleet-ingest ──▶ TimescaleDB ──▶ api-core ──▶ web (M4 realtime)
Vektor/atribut ──────▶ PostGIS ──▶ geo-api (OGC Features) ──▶ web (MapLibre)
```

---

## 3. Topologi deployment (hybrid)

```
                 Internet
        ┌───────────┴───────────┐
   Vercel (web)            server tambang / VPS
   sanjaya.app             ┌─ Traefik (TLS) ─────────────┐
   static React            │  /api   → api-core          │
        │                  │  /ogc   → geo-api/geoserver │
        └──── HTTPS ───────▶  /tiles → MinIO/tiler       │
         (JWT + CORS)      │  /mqtt  → mosquitto (wss)   │
                           ├─ postgis · timescale        │
                           ├─ redis · minio              │
                           └─ worker · fleet-ingest      │
```

- **Frontend** (`web`) di-build statis dan di-deploy ke **Vercel**. Hanya butuh satu env: `VITE_API_BASE=https://api.sanjaya.example`.
- **Backend** seluruhnya di server (VPS untuk dev/demo; sama persis di on-prem nanti).
- **CORS** dibatasi ke domain Vercel; **JWT** untuk semua endpoint non-publik.
- **Air-gapped path**: ketika dibutuhkan, `web` ikut di-host oleh Traefik di server (Nginx static) tanpa Vercel — tidak ada perubahan kode, hanya target build. Itu sebabnya frontend tidak boleh punya dependensi runtime ke layanan Vercel.

---

## 4. Model data (epoch-centric)

### 4.1 Tulang punggung temporal

```
epoch
  id PK · konsesi_id FK · tanggal · sensor · gsd_cm · jumlah_gcp
  crs_epsg · catatan · dibuat_oleh · dibuat_pada

dataset                         -- katalog M6
  id PK · epoch_id FK · modul · jenis(point_cloud|dsm|ortho|mesh|vektor)
  format · uri_minio · crs_epsg · lineage · akurasi · ukuran_byte
```

Semua entitas spasial yang berubah terhadap waktu **mengacu `epoch_id`**. Perbandingan antar-epoch (M2 cut-fill, M3 design-to-actual, M1 time-slider) = query dua `epoch_id`.

### 4.2 Tabel inti per modul (ringkas)

| Modul | Tabel utama | Kolom geometri / kunci |
|---|---|---|
| M1 | `layer`, `dataset` | `geom`/URI 3D Tiles, `epoch_id` |
| M2 | `stockpile`, `stockpile_volume` | `toe_polygon geometry(PolygonZ)`, `base_plane`, `volume_m3`, `tonase`, `uncertainty`, `epoch_id` |
| M3 | `pit_design`, `pit_component`, `deviasi_cell` | `geom(MultiPolygonZ)`, atribut bench/berm/batter, `epoch_id` ref aktual |
| M4 | `unit`, `unit_trail` (TimescaleDB hypertable), `geofence`, `bbm_estimasi` | `pos geometry(PointZ)`, `ts`, `status`, `fuel` |
| M5 | `kpi_snapshot`, `alert`, `recommendation` | agregat lintas modul, `severity`, `modul`, `ts` |
| M6 | `dataset`, `connector`, `audit_log` | metadata, `status`, lineage |
| M7 | `slope_segment`, `geotech_reading` | `geom(LineStringZ)`, `fk`, `pk`, `ambang`, `ts` |
| M8 | `parcel`, `parcel_status_history`, `permit`, `kawasan`, `conflict` | `geom(MultiPolygon)`, `nib`, `status`, `nilai`, `masa_berlaku` |

Migrasi dikelola **Alembic**; PostGIS & Timescale di-enable lewat migration awal.

---

## 5. Kontrak API (dibekukan dari awal)

Konvensi: REST JSON di `/api/v1`, data spasial via **OGC API Features** di `/ogc` (GeoJSON), file via presigned URL MinIO. Semua butuh `Authorization: Bearer <jwt>` kecuali `/api/v1/auth/*`.

| Modul | Endpoint kunci | Catatan |
|---|---|---|
| Auth | `POST /auth/login` · `GET /auth/me` | JWT, klaim `role` |
| M1 | `GET /ogc/collections/{layer}/items` · `GET /datasets?epoch=` · `GET /tiles/{dataset}/tileset.json` | OGC Features + 3D Tiles |
| M2 | `GET /stockpiles` · `GET /stockpiles/{id}?epoch=` · `POST /stockpiles/{id}/volume` (hitung) · `GET /stockpiles/{id}/diff?from=&to=` · `GET /export/...` | hitung = Celery job, balik `job_id` |
| M3 | `POST /pit-designs` (upload DXF/LandXML) · `GET /pit-designs/{id}` · `GET /pit-designs/{id}/deviation?actual_epoch=` · `GET /cross-section?line=` | diff async |
| M4 | `GET /units` · `WS /units/stream` · `GET /units/{id}/trail?shift=` · `GET /fleet/kpi` · `GET /fleet/heatmap` | WS dari TimescaleDB/MQTT |
| M5 | `GET /dashboard?role=` · `GET /alerts` · `GET /recommendations` | agregat; role-aware |
| M6 | `GET /datasets` · `POST /datasets` (upload) · `GET /connectors` · `GET /audit-log` | ETL connector |
| M7 | `GET /slopes` · `GET /slopes/{id}` · `GET /geotech/readings?segment=` | ambang FK<1.2, PK>10% |
| M8 | `GET /parcels` · `PATCH /parcels/{id}/status` · `GET /permits` · `GET /conflicts` · `GET /land/dashboard` | pipeline kanban + reminder izin |

**Job berat** (M2/M3/tiling) selalu pola async: `POST` → `{job_id}` → poll `GET /jobs/{job_id}` → hasil. Tidak ada request HTTP yang menunggu proses menit-menitan.

---

## 6. RBAC — 9 peran (SRS §2)

Matriks akses jadi tabel `role_permission` (seed). `read` = lihat, `write` = ubah, `—` = tidak ada.

| Peran | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 |
|---|---|---|---|---|---|---|---|---|
| Owner/Manajemen | r | r | r | r | r | r | r | r |
| KTT/Mine Manager | r | r | w | r | w | r | w | r |
| Surveyor | w | w | r | — | r | w | — | — |
| Mine Plan Engineer | r | r | w | — | r | r | r | — |
| Dispatcher/Operasi | r | — | — | w | r | — | — | — |
| Geotech Engineer | r | — | r | — | r | — | w | — |
| Tim Pembebasan Lahan | r | — | — | — | r | — | — | w |
| Tim Legal & Perizinan | r | — | — | — | r | — | — | w |
| Inspektur/Auditor | r | r | r | r | r | r | r | r (read-only terbatas) |

Frontend: role switcher di top-bar (sudah ada di desain) men-set konteks; backend tetap menegakkan via JWT — UI tidak pernah jadi satu-satunya gerbang.

---

## 7. Penanganan kebutuhan non-fungsional (SRS §4)

| Kebutuhan | Cara dipenuhi |
|---|---|
| Kinerja point cloud ≥30 FPS | 3D Tiles + LoD otomatis (Cesium); tiling oleh `tiler`, disajikan dari MinIO/CDN |
| Query peta < 2 dtk | Index GIST PostGIS, cache Redis untuk agregat, pagination OGC Features |
| Skalabilitas | Worker Celery horizontal; TimescaleDB hypertable + retention; service terpisah bisa di-scale sendiri |
| Ketersediaan ≥99% / degraded | Healthcheck Compose; frontend cache (TanStack Query) tetap tampil data terakhir saat backend lambat |
| Keamanan | JWT + RBAC; TLS via Traefik; enkripsi at-rest (volume terenkripsi/MinIO SSE); `audit_log` |
| Portabilitas data | Semua format OGC/3D Tiles; ekspor CSV/DXF/PDF (M2) |
| Konektivitas lapangan | PWA mobile (offline cache); MQTT QoS; sync tertunda saat online |

---

## 8. Strategi mock-first per fase

Mengikuti Roadmap SRS §7. Tiap fase = service yang sebelumnya *stub* jadi aktif. Kontrak API tidak berubah antar fase.

| Fase | Fokus SRS | Service di-aktifkan | Indikator selesai |
|---|---|---|---|
| **0** | Fondasi repo | `web`, `proxy`, `api-core`(mock), `postgis`, `redis`, `minio` | 8 modul navigable dari seed, login+RBAC jalan |
| **1** | M1, M6 | `geo-api`, `tiler` | Upload drone → 3D Tiles tampil; katalog data real |
| **2** | M2 | `worker` (volumetrik, cut-fill) | Volume per epoch dihitung asli, ekspor CSV/DXF/PDF |
| **3** | M3, M7, M8 | parser pit, ingest geoteknik, import bidang | Design-to-actual & status lahan dari data nyata |
| **4** | M4 | `fleet-ingest`, `mqtt` real, `timescale` | Posisi unit & estimasi BBM live |
| **5** | M5 | rule engine → AI/ML | Early-warning & rekomendasi dari data lintas modul |

Penting: **Fase 0 sudah memberi sistem "utuh" untuk demo** — semua layar hidup, semua endpoint menjawab. Sisanya menambah kebenaran data, bukan menambah layar.

---

## 9. Lingkungan pengembangan

```bash
# satu perintah, seluruh backend
docker compose up -d            # postgis, timescale, redis, minio, mqtt, api-core, geo-api, worker
docker compose run api alembic upgrade head
docker compose run api python -m seed.load    # isi semua modul dengan data mock

# frontend
cd web && npm install && npm run dev           # http://localhost:5173 → VITE_API_BASE=localhost
```

- **Seed** (`seed/`) menyediakan: 1 konsesi, 3–6 epoch, beberapa stockpile, 1 pit design sample, ~10 unit armada + trail, segmen lereng, dan layer bidang M8 — semua GeoJSON/CSV + 1 sample LAZ kecil. Cukup untuk mengisi setiap layar persis seperti desain handoff.
- **Vercel preview**: setiap PR frontend → preview URL otomatis, menunjuk ke backend dev di server.

---

## 10. Pemetaan ke desain UI (handoff)

Desain neo-brutalist dari Claude Design dipakai apa adanya sebagai acuan visual. Token yang diangkat jadi theme Tailwind:

| Token | Nilai |
|---|---|
| Background | `#FBF7EF` (cream) · panel `#fff` |
| Ink / border | `#141414` (2.5px) · shadow keras `Npx Npx 0 #141414` |
| Aksen | accent (mis. kuning tambang) · merah alert `#FF4D4D` · hijau OK |
| Font | Archivo (display/UI) · Space Mono (data/mono) |
| Radius | 8–14px |

Branding **"BaraGIS" → "SANJAYA"** di top-bar. Layout: top-bar (role switcher, 2D/3D toggle, epoch badge) · module rail kiri (M1–M8) · center workspace (peta atau dashboard) · right panel kontekstual per modul · plus mobile field view (PWA).

---

## 11. Risiko & keputusan terbuka

| Hal | Catatan |
|---|---|
| GeoServer vs pygeoapi | Mulai pygeoapi (ringan, OGC Features). GeoServer hanya bila perlu rendering raster WMS berat. |
| Cesium ion | Dihindari sebagai dependensi wajib (lock-in). Self-host tiling. ion opsional untuk terrain global. |
| Auth: JWT vs Keycloak | JWT cukup untuk 9 peran internal. Keycloak hanya bila ada SSO korporat. |
| Integrasi ATR-BPN/MOMI (M8) | Tergantung PKS resmi (per SRS). Dirancang menyerap SHP/WFS saat kanal tersedia; sementara pakai data internal. |
| AI/ML (M5 F5.4) | Ditunda sampai ada histori. Mulai rule-based; ML belakangan. |
```

