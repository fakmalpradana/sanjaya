import { useState } from 'react';
import { useStockpiles, useStockpile } from '../api';
import { ProgressBar } from '../components/ui/ProgressBar';
import type { Stockpile, StockpileDetail } from '../types';

function SparkBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 30 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          width: 6,
          height: `${(v / max) * 100}%`,
          background: '#FFD23F',
          border: '1px solid #141414',
          borderRadius: '2px 2px 0 0',
          minHeight: 2,
        }} />
      ))}
    </div>
  );
}

export default function M2Stockpile() {
  const { data: stockpiles = [], isLoading, isError } = useStockpiles();
  const [selectedId, setSelectedId] = useState<string>('');
  const { data: detail, isLoading: loadingDetail } = useStockpile(selectedId);

  if (isLoading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#8A8270' }} className="mono">Memuat data...</div>
  );
  if (isError) return (
    <div style={{ margin: 24, padding: 16, background: '#FFFBEE', border: '2px solid #FFD23F', borderRadius: 11 }}>
      <div style={{ fontWeight: 800, fontSize: 13 }}>Gagal memuat data</div>
      <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 4 }}>
        Pastikan backend berjalan: <code>docker compose up -d</code>
      </div>
    </div>
  );

  const selected = selectedId || (stockpiles[0]?.id ?? '');
  const activeDetail: StockpileDetail | null = detail?.detail ?? null;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      {/* Left: Stockpile List */}
      <div style={{
        width: 340,
        borderRight: '2.5px solid #141414',
        overflowY: 'auto',
        padding: 14,
        background: '#FBF7EF',
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.4, marginBottom: 14 }}>
          Inventori Stockpile
        </div>
        {(stockpiles as Stockpile[]).map((s: Stockpile) => (
          <div
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            style={{
              background: '#fff',
              border: `2.5px solid ${s.id === (selectedId || stockpiles[0]?.id) ? '#FFD23F' : '#141414'}`,
              borderRadius: 11,
              boxShadow: s.id === (selectedId || stockpiles[0]?.id) ? '3px 3px 0 #FFD23F' : '3px 3px 0 #141414',
              padding: '12px 14px',
              marginBottom: 10,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 13, height: 13, borderRadius: '50%', background: s.color, border: '2px solid #141414', flexShrink: 0 }} />
              <span style={{ fontWeight: 900, fontSize: 13, flex: 1 }}>{s.name}</span>
              {s.anomaly && (
                <span className="mono" style={{
                  fontSize: 8, fontWeight: 700, color: '#fff',
                  background: '#FF4D4D', border: '1.5px solid #141414',
                  borderRadius: 4, padding: '2px 5px',
                }}>ANOMALI</span>
              )}
            </div>
            <div className="mono" style={{ fontSize: 9, color: '#8A8270', marginBottom: 8 }}>{s.material}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5, lineHeight: 1 }}>
                  {s.volume_m3.toLocaleString('id-ID')}
                </div>
                <div className="mono" style={{ fontSize: 9, color: '#8A8270' }}>m³</div>
              </div>
              <SparkBars values={s.spark} />
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontWeight: 800, fontSize: 12,
                  color: s.delta_pct >= 0 ? '#52B788' : '#FF4D4D',
                }}>
                  {s.delta_pct >= 0 ? '+' : ''}{s.delta_pct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#fff' }}>
        {loadingDetail ? (
          <div className="mono" style={{ fontSize: 10, color: '#8A8270', padding: 20 }}>Memuat detail...</div>
        ) : !activeDetail ? (
          <div style={{ padding: 20, color: '#8A8270', fontSize: 13 }}>
            Pilih stockpile untuk melihat detail.
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, marginBottom: 16 }}>
              Detail Stockpile
            </div>

            {/* 4 Metric Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
              {[
                { label: 'Volume', val: detail?.volume_m3?.toLocaleString('id-ID') ?? '—', unit: 'm³' },
                { label: 'Tonase', val: detail?.tonase?.toLocaleString('id-ID') ?? '—', unit: 'ton' },
                { label: 'Delta', val: `${(detail?.delta_pct ?? 0) >= 0 ? '+' : ''}${detail?.delta_pct?.toFixed(1) ?? '0'}%`, unit: '' },
                { label: 'Uncertainty', val: activeDetail.uncertainty, unit: '' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: '#FBF7EF', border: '2px solid #141414',
                  borderRadius: 9, padding: '10px 12px', boxShadow: '2px 2px 0 #141414',
                }}>
                  <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginBottom: 4 }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontWeight: 900, fontSize: 17, lineHeight: 1 }}>{m.val}</div>
                  <div className="mono" style={{ fontSize: 9, color: '#8A8270' }}>{m.unit}</div>
                </div>
              ))}
            </div>

            {/* Technical Params */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[
                { label: 'Base Plane', val: activeDetail.base_plane },
                { label: 'Toe Polygon', val: activeDetail.toe_polygon },
                { label: 'Cut / Fill', val: activeDetail.cut_fill },
              ].map((p, i) => (
                <div key={i} style={{ background: '#FBF7EF', border: '2px solid #141414', borderRadius: 9, padding: '9px 12px', boxShadow: '2px 2px 0 #141414' }}>
                  <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginBottom: 3 }}>{p.label.toUpperCase()}</div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{p.val}</div>
                </div>
              ))}
            </div>

            {/* Export Buttons */}
            <div style={{ display: 'flex', gap: 9, marginBottom: 20 }}>
              {['CSV', 'DXF', 'PDF'].map(fmt => (
                <button key={fmt} style={{
                  border: '2px solid #141414', borderRadius: 8,
                  background: '#FBF7EF', boxShadow: '2px 2px 0 #141414',
                  padding: '7px 16px', fontWeight: 800, fontSize: 11,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>↓ {fmt}</button>
              ))}
            </div>

            {/* Difference Map (placeholder) */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 9 }}>Peta Beda Ketinggian (DoD)</div>
              <div style={{
                height: 180, border: '2.5px solid #141414', borderRadius: 11,
                boxShadow: '3px 3px 0 #141414',
                background: 'radial-gradient(circle at 40% 50%, #FF4D4D 0%, #FFD23F 25%, #FBF7EF 50%, #A8D5BA 70%, #1B4D3E 100%)',
                position: 'relative',
                display: 'flex', alignItems: 'flex-end',
              }}>
                {/* Legend */}
                <div style={{
                  position: 'absolute', right: 10, top: 10,
                  background: 'rgba(255,255,255,0.92)', border: '1.5px solid #141414',
                  borderRadius: 7, padding: '7px 10px',
                }}>
                  <div className="mono" style={{ fontSize: 8, fontWeight: 700, marginBottom: 5 }}>BEDA KETINGGIAN</div>
                  {[{ c: '#FF4D4D', l: '+3m (fill)' }, { c: '#FFD23F', l: '+1m' }, { c: '#FBF7EF', l: '0m' }, { c: '#A8D5BA', l: '-1m' }, { c: '#1B4D3E', l: '-3m (cut)' }].map((x, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <span style={{ width: 10, height: 10, background: x.c, border: '1px solid #141414', borderRadius: 2, flexShrink: 0 }} />
                      <span className="mono" style={{ fontSize: 8 }}>{x.l}</span>
                    </div>
                  ))}
                </div>
                <div className="mono" style={{ padding: '8px 12px', fontSize: 8, color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>
                  PLACEHOLDER · ACTUAL POINT CLOUD RENDERING
                </div>
              </div>
            </div>

            {/* Trend Bars */}
            <div>
              <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 9 }}>Tren Volume per Epoch</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 150, padding: '0 4px' }}>
                {activeDetail.trend_bars.map((b, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{
                      width: '100%',
                      height: `${b.h}%`,
                      background: '#FFD23F',
                      border: '2px solid #141414',
                      borderRadius: '4px 4px 0 0',
                      alignSelf: 'flex-end',
                      minHeight: 4,
                    }} />
                    <span className="mono" style={{ fontSize: 7.5, color: '#8A8270', fontWeight: 700 }}>{b.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
