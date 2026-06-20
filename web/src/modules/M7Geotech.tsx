import { useState } from 'react';
import { useSlopes } from '../api';
import { MapWorkspace } from '../map/MapWorkspace';
import type { SlopeSegment } from '../types';

const STATUS_COLORS: Record<string, string> = {
  AMAN: '#52B788',
  WASPADA: '#FF7A30',
  KRITIS: '#FF4D4D',
};

export default function M7Geotech() {
  const { data: slopes = [], isLoading, isError } = useSlopes();
  const [selectedSlope, setSelectedSlope] = useState<string>('');

  const active: SlopeSegment | undefined = slopes.find((s: SlopeSegment) => s.id === selectedSlope) ?? slopes[0];

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
        <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.4, marginBottom: 16 }}>
          Geoteknik &amp; Keselamatan
        </div>

        {isLoading ? (
          <div className="mono" style={{ fontSize: 10, color: '#8A8270' }}>Memuat data...</div>
        ) : isError ? (
          <div style={{ padding: 12, background: '#FFFBEE', border: '2px solid #FFD23F', borderRadius: 9 }}>
            <div style={{ fontWeight: 800, fontSize: 12 }}>Gagal memuat data</div>
            <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 4 }}>
              Pastikan backend berjalan: <code>docker compose up -d</code>
            </div>
          </div>
        ) : (
          <>
            {/* Selected Slope Detail */}
            {active && (
              <div style={{
                background: '#FBF7EF', border: '2.5px solid #141414',
                borderRadius: 12, padding: '14px 16px', marginBottom: 18,
                boxShadow: '4px 4px 0 #141414',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginBottom: 4 }}>FACTOR OF SAFETY</div>
                    <div style={{
                      fontWeight: 900, fontSize: 40, letterSpacing: -1, lineHeight: 1,
                      color: STATUS_COLORS[active.status] || '#141414',
                    }}>
                      {active.fk.toFixed(2)}
                    </div>
                  </div>
                  <span className="mono" style={{
                    fontSize: 9, fontWeight: 700, color: '#fff',
                    background: STATUS_COLORS[active.status] || '#141414',
                    border: '2px solid #141414', borderRadius: 5,
                    padding: '4px 8px',
                  }}>{active.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginBottom: 2 }}>PROBABILITAS KERUNTUHAN</div>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>{active.pk.toFixed(1)}<span style={{ fontSize: 11, fontWeight: 700, color: '#8A8270' }}>%</span></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginBottom: 2 }}>SEGMEN</div>
                    <div style={{ fontWeight: 900, fontSize: 15 }}>{active.seg}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="mono" style={{ fontSize: 8, color: '#52B788', fontWeight: 700 }}>FK MIN = 1.00</span>
                    <span className="mono" style={{ fontSize: 8, color: '#FF4D4D', fontWeight: 700 }}>FK KRITIS = 1.10</span>
                    <span className="mono" style={{ fontSize: 8, color: '#FFD23F', fontWeight: 700 }}>FK WASPADA = 1.25</span>
                  </div>
                  <div style={{ height: 6, border: '2px solid #141414', borderRadius: 4, background: '#E6DFCD', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, ((active.fk - 1.0) / 0.8) * 100)}%`,
                      height: '100%',
                      background: STATUS_COLORS[active.status] || '#141414',
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* Slope Segment List */}
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 10 }}>Segmen Lereng</div>
            {(slopes as SlopeSegment[]).map((s: SlopeSegment) => (
              <div
                key={s.id}
                onClick={() => setSelectedSlope(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  border: `2px solid ${s.id === (selectedSlope || slopes[0]?.id) ? '#FFD23F' : '#141414'}`,
                  borderRadius: 9, marginBottom: 7,
                  boxShadow: s.id === (selectedSlope || slopes[0]?.id) ? '2px 2px 0 #FFD23F' : '2px 2px 0 #141414',
                  background: '#fff', cursor: 'pointer',
                }}
              >
                <span style={{
                  width: 10, height: 10, flexShrink: 0,
                  borderRadius: '50%',
                  background: STATUS_COLORS[s.status] || '#8A8270',
                  border: '2px solid #141414',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{s.seg}</div>
                  <div className="mono" style={{ fontSize: 8.5, color: '#8A8270' }}>FK {s.fk.toFixed(2)} · PK {s.pk.toFixed(1)}%</div>
                </div>
                <span className="mono" style={{
                  fontSize: 8, fontWeight: 700,
                  color: STATUS_COLORS[s.status] || '#8A8270',
                }}>{s.status}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
