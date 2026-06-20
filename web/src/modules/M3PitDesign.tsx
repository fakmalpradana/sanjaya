import { usePitDesigns } from '../api';
import { MapWorkspace } from '../map/MapWorkspace';

export default function M3PitDesign() {
  const { data: designs = [], isLoading, isError } = usePitDesigns();
  const design = designs[0] ?? null;

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
        <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.4, marginBottom: 16 }}>Pit Design · Design-to-Actual</div>

        {isLoading ? (
          <div className="mono" style={{ fontSize: 10, color: '#8A8270' }}>Memuat data...</div>
        ) : isError ? (
          <div style={{ padding: 12, background: '#FFFBEE', border: '2px solid #FFD23F', borderRadius: 9 }}>
            <div style={{ fontWeight: 800, fontSize: 12 }}>Gagal memuat data</div>
            <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 4 }}>
              Pastikan backend berjalan: <code>docker compose up -d</code>
            </div>
          </div>
        ) : !design ? (
          <div style={{ fontSize: 12, color: '#8A8270' }}>Tidak ada pit design tersedia.</div>
        ) : (
          <>
            {/* Design name */}
            <div style={{
              background: '#FBF7EF', border: '2.5px solid #141414', borderRadius: 11,
              padding: '12px 14px', marginBottom: 16, boxShadow: '3px 3px 0 #141414',
            }}>
              <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginBottom: 4 }}>PIT DESIGN AKTIF</div>
              <div style={{ fontWeight: 900, fontSize: 15 }}>{design.name ?? '—'}</div>
              <div className="mono" style={{ fontSize: 9, color: '#8A8270', marginTop: 2 }}>{design.date ?? ''}</div>
            </div>

            {/* Components Table */}
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Komponen Design</div>
            <div style={{ border: '2.5px solid #141414', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              {(design.components ?? []).map((c: any, i: number) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px',
                  borderBottom: i < (design.components?.length ?? 0) - 1 ? '1.5px solid #E6DFCD' : 'none',
                  background: i % 2 === 0 ? '#fff' : '#FBF7EF',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{c.name}</span>
                  <span className="mono" style={{ fontSize: 10, fontWeight: 700 }}>{c.value}</span>
                </div>
              ))}
            </div>

            {/* Deviasi Box */}
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Deviasi Design-to-Actual</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
              {[
                { label: 'Max Fill', val: design.deviation?.max_fill ?? '—', color: '#52B788' },
                { label: 'Max Cut', val: design.deviation?.max_cut ?? '—', color: '#FF4D4D' },
                { label: 'Out of Tol.', val: design.deviation?.oot_pct ?? '—', color: '#FF7A30' },
              ].map((d, i) => (
                <div key={i} style={{
                  background: '#FBF7EF', border: `2px solid ${d.color}`,
                  borderRadius: 8, padding: '9px 10px', textAlign: 'center',
                  boxShadow: `2px 2px 0 ${d.color}`,
                }}>
                  <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginBottom: 4 }}>{d.label.toUpperCase()}</div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: d.color }}>{d.val}</div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button style={{
              width: '100%', border: '2.5px solid #141414', borderRadius: 9,
              background: '#FFD23F', boxShadow: '3px 3px 0 #141414',
              padding: '12px 0', fontWeight: 800, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              + Buat Penampang Melintang
            </button>
          </>
        )}
      </div>
    </div>
  );
}
