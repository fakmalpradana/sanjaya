import { useFleetKpi, useUnits } from '../api';
import { MapWorkspace } from '../map/MapWorkspace';
import type { FleetUnit } from '../types';

const STATUS_COLORS: Record<string, string> = {
  AKTIF: '#52B788',
  IDLE: '#FFD23F',
  MAINTENANCE: '#FF7A30',
  RUSAK: '#FF4D4D',
};

export default function M4Fleet() {
  const { data: kpiData, isLoading: loadingKpi } = useFleetKpi();
  const { data: units = [], isLoading: loadingUnits, isError } = useUnits();

  const kpiCards: any[] = kpiData?.kpis ?? [];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapWorkspace />
      </div>

      {/* Right Panel */}
      <div style={{
        width: 328, flexShrink: 0,
        borderLeft: '2.5px solid #141414',
        overflowY: 'auto',
        padding: 16,
        background: '#fff',
      }}>
        <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.4, marginBottom: 16 }}>Pemantauan Armada</div>

        {/* KPI 2x2 */}
        {loadingKpi ? (
          <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginBottom: 16 }}>Memuat KPI...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
            {kpiCards.map((k: any, i: number) => (
              <div key={i} style={{
                background: '#FBF7EF', border: '2.5px solid #141414',
                borderRadius: 10, padding: '10px 12px', boxShadow: '3px 3px 0 #141414',
              }}>
                <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginBottom: 4 }}>{(k.en ?? k.label).toUpperCase()}</div>
                <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5, lineHeight: 1 }}>{k.val}</div>
                <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginTop: 2 }}>{k.unit}</div>
              </div>
            ))}
          </div>
        )}

        {/* Unit List */}
        <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 10 }}>Unit Aktif</div>
        {loadingUnits ? (
          <div className="mono" style={{ fontSize: 10, color: '#8A8270' }}>Memuat unit...</div>
        ) : isError ? (
          <div style={{ padding: 12, background: '#FFFBEE', border: '2px solid #FFD23F', borderRadius: 9 }}>
            <div className="mono" style={{ fontSize: 10, color: '#8A8270' }}>Gagal memuat — backend offline</div>
          </div>
        ) : (
          (units as FleetUnit[]).map((u: FleetUnit) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              border: '2px solid #141414',
              borderRadius: 9, marginBottom: 8,
              boxShadow: '2px 2px 0 #141414',
              background: '#fff',
            }}>
              {/* Status dot */}
              <span style={{
                width: 11, height: 11, flexShrink: 0,
                borderRadius: '50%',
                background: u.color || STATUS_COLORS[u.status] || '#8A8270',
                border: '2px solid #141414',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="mono" style={{ fontWeight: 800, fontSize: 11 }}>{u.id}</span>
                  <span style={{ fontSize: 10, color: '#8A8270' }}>{u.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span className="mono" style={{
                    fontSize: 8, fontWeight: 700,
                    color: STATUS_COLORS[u.status] || '#8A8270',
                  }}>{u.status}</span>
                  {/* Fuel bar */}
                  <div style={{ flex: 1, maxWidth: 60 }}>
                    <div style={{
                      height: 5, border: '1.5px solid #141414', borderRadius: 4,
                      background: '#FBF7EF', overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${u.fuel_pct}%`, height: '100%',
                        background: u.fuel_pct > 50 ? '#52B788' : u.fuel_pct > 20 ? '#FFD23F' : '#FF4D4D',
                      }} />
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: 8, color: '#8A8270' }}>{u.fuel_pct}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
