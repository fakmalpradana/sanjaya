# SANJAYA — Open Data Sources

Data yang diunduh dan digunakan sebagai seed/mock data untuk SANJAYA WebGIS.

## Dataset

### 1. OSM Coal Mine / Quarry Polygons (Kalimantan)
- **Sumber**: OpenStreetMap contributors
- **Lisensi**: ODbL (Open Database License)
- **URL**: https://overpass-api.de/ (query `landuse=quarry` bbox Kalimantan)
- **Tanggal unduh**: 2026-06-20
- **Isi**: 63 polygon area tambang batu bara — 27 di Sangatta (Kutai Timur) + 36 di area Adaro (Kalimantan Selatan)
- **File**: `open_data/coal_mines_kalimantan.geojson`, `open_data/wiup_kalimantan.geojson`
- **Dipakai di**: `seed/data/konsesi.geojson`, `seed/data/wiup_blocks.geojson`, `seed/data/m8_land.json`

### 2. SRTM 30m Elevation Grid (Kutai Timur)
- **Sumber**: NASA SRTM via OpenTopoData API
- **Lisensi**: Public Domain (NASA)
- **URL**: https://api.opentopodata.org/v1/srtm30m
- **Coverage**: Grid 10×10 titik, 0°N–1°N, 117°E–118°E (area Sangatta, Kutai Timur)
- **Tanggal unduh**: 2026-06-20
- **Isi**: 100 titik elevasi, range 0–234m, resolusi ~11km
- **File**: `open_data/srtm_sangatta_grid.geojson`, `seed/data/terrain_profile.json`
- **Dipakai di**: M1 terrain visualization (Phase 1: ganti dengan SRTM GeoTIFF tile)
- **Catatan**: Resolusi coarse (0.1°). Untuk produksi, gunakan tile SRTM 30m dari USGS EarthExplorer.

### 3. Operator Tambang (Referensi Publik)
- **Sumber**: OpenStreetMap tags + data publik perusahaan
- **Isi**: 5 operator utama batu bara Kalimantan (KPC, Adaro, Berau Coal, Arutmin, Kideco)
- **File**: `seed/data/mine_companies.json`

## Dataset yang tidak berhasil diunduh secara otomatis

| Dataset | Alasan | Cara akses manual |
|---------|--------|-------------------|
| **MOMI WIUP/IUP** (ESDM) | Memerlukan login akun ESDM | https://momi.minerba.esdm.go.id |
| **Global Coal Mine Tracker** (GEM) | Link download berubah, perlu registrasi | https://globalenergymonitor.org/projects/global-coal-mine-tracker/download-data/ — Lisensi CC BY 4.0 |
| **SRTM GeoTIFF tile** (NASA/USGS) | Memerlukan akun EarthData | https://earthexplorer.usgs.gov/ → pilih tile N00E117 (Sangatta) |
| **LiDAR Kalimantan** (NASA ORNL) | Memerlukan akun NASA EarthData | https://data.ornldaac.earthdata.nasa.gov — CMS LiDAR Indonesia 2014 |

## Cara mendapatkan data tambahan untuk Phase 1+

```bash
# SRTM 30m tile untuk Sangatta (Kutai Timur)
# 1. Daftar akun di https://urs.earthdata.nasa.gov/
# 2. Download tile N00E117 dari EarthExplorer
# 3. Letakkan di minio/tiles/srtm/

# LiDAR Kalimantan (NASA CMS, 2014, 409 file .laz)
# URL: https://daac.ornl.gov/CMS/guides/CMS_LiDAR_Indonesia.html
# Memerlukan EarthData login

# OSM Kalimantan lengkap (roads, rivers — untuk fleet routing M4)
# wget https://download.geofabrik.de/asia/indonesia/kalimantan-latest.osm.pbf

# GADM admin boundaries Indonesia level 2 (kabupaten)
# https://gadm.org/download_country.html → IDN level 2
```

## Attributions

- © OpenStreetMap contributors — ODbL license
- NASA SRTM Digital Elevation 30m — Public Domain
- OpenTopoData API — open source
