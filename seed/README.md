# SANJAYA — Seed Data

Mock data untuk Phase 0 development. Semua data adalah contoh fiktif untuk keperluan demonstrasi.

## Cara kerja

Backend FastAPI membaca file JSON dari direktori ini saat startup (via `SEED_DIR` environment variable).
Tidak perlu perintah load manual — data otomatis tersedia saat `docker compose up`.

## Files

| File | Modul | Isi |
|---|---|---|
| `epochs.json` | Semua | 6 epoch survei dari Jul 2025 – Jan 2026 |
| `m1_layers.json` | M1 | 8 layer peta (DTM, Ortofoto, Point Cloud, dll.) |
| `m2_stockpiles.json` | M2 | 4 stockpile dengan volume, tonase, trend, dan anomali |
| `m3_pit.json` | M3 | 1 pit design dengan komponen geometri dan deviasi |
| `m4_units.json` | M4 | 7 unit armada (5 DT + 2 Excavator) |
| `m4_fleet_kpi.json` | M4 | 4 KPI armada |
| `m5_dashboard.json` | M5 | 6 KPI produksi, grafik vs RKAB, status lahan |
| `m5_alerts.json` | M5 | 5 early warning aktif lintas modul |
| `m5_recommendations.json` | M5 | 4 rekomendasi DSS |
| `m6_data.json` | M6 | 5 dataset + 6 konektor |
| `m7_slopes.json` | M7 | 5 segmen lereng dengan FK dan PK |
| `m8_land.json` | M8 | Pipeline pembebasan, izin, dan konflik lahan |

## Phase 1+

Saat data asli tersedia, backend akan diganti ke query PostGIS nyata.
Kontrak API endpoint tidak berubah — hanya implementasi handler-nya.
