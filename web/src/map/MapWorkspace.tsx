import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LayerPanel } from './LayerPanel';
import { MeasureTools } from './MeasureTools';
import { TimeSlider } from './TimeSlider';

declare const Cesium: any; // CDN global

export function MapWorkspace() {
  const viewMode = useStore(s => s.viewMode);
  const cesiumRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<any>(null);
  const maplibreRef = useRef<maplibregl.Map | null>(null);

  // Cesium 3D
  useEffect(() => {
    if (viewMode !== '3D' || !cesiumRef.current) return;
    if (typeof Cesium === 'undefined') return;

    const viewer = new Cesium.Viewer(cesiumRef.current, {
      imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' }),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    });

    // Fly to Kalimantan (placeholder mine location)
    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(115.23, -2.34, 12000) });
    cesiumViewerRef.current = viewer;

    return () => {
      if (cesiumViewerRef.current && !cesiumViewerRef.current.isDestroyed()) {
        cesiumViewerRef.current.destroy();
        cesiumViewerRef.current = null;
      }
    };
  }, [viewMode]);

  // MapLibre 2D
  useEffect(() => {
    if (viewMode !== '2D' || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [115.23, -2.34],
      zoom: 13,
    });
    maplibreRef.current = map;

    return () => {
      maplibreRef.current?.remove();
      maplibreRef.current = null;
    };
  }, [viewMode]);

  const cesiumUnavailable = viewMode === '3D' && typeof Cesium === 'undefined';

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Map containers — both exist, visibility toggled */}
      <div
        ref={cesiumRef}
        style={{ position: 'absolute', inset: 0, display: viewMode === '3D' ? 'block' : 'none' }}
      />
      <div
        ref={mapRef}
        style={{ position: 'absolute', inset: 0, display: viewMode === '2D' ? 'block' : 'none' }}
      />

      {/* Cesium unavailable placeholder */}
      {cesiumUnavailable && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #FBF7EF, #F2EAD8)',
        }}>
          <div style={{
            background: '#fff',
            border: '2.5px solid #141414',
            borderRadius: 12,
            boxShadow: '5px 5px 0 #141414',
            padding: '18px 22px',
            textAlign: 'center',
            maxWidth: 300,
          }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>3D Globe · Memuat CesiumJS</div>
            <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 8, lineHeight: 1.5 }}>
              Streaming terrain &amp; point cloud. Memerlukan koneksi internet untuk CDN.
            </div>
          </div>
        </div>
      )}

      {/* Overlays */}
      <LayerPanel />
      <MeasureTools />
      <TimeSlider />

      {/* Compass + Scale */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      }}>
        <div style={{
          width: 46, height: 46,
          background: '#fff',
          border: '2.5px solid #141414',
          borderRadius: '50%',
          boxShadow: '3px 3px 0 #141414',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{ position: 'absolute', top: 3, fontWeight: 900, fontSize: 10, color: '#FF4D4D' }}>N</span>
          <svg width={16} height={20} viewBox="0 0 16 20">
            <path d="M8 1 13 19 8 14 3 19Z" fill="#141414" />
            <path d="M8 1 8 14 3 19Z" fill="#FF4D4D" />
          </svg>
        </div>
        <div className="mono" style={{
          background: '#fff',
          border: '2.5px solid #141414',
          borderRadius: 7,
          boxShadow: '3px 3px 0 #141414',
          padding: '5px 9px',
          fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <span style={{
            display: 'inline-block',
            width: 42, height: 6,
            border: '2px solid #141414',
            borderTop: 'none',
            background: 'repeating-linear-gradient(90deg,#141414 0 7px,#fff 7px 14px)',
          }} />
          200 m
        </div>
      </div>
    </div>
  );
}
