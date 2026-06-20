import { useLandDashboard } from '../api';
import { ProgressBar } from '../components/ui/ProgressBar';

export default function M8Land() {
  const { data, isLoading, isError } = useLandDashboard();

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

  const kpis: any[] = data?.kpis ?? [];
  const parcelCols: any[] = data?.parcel_cols ?? [];
  const permits: any[] = data?.permits ?? [];
  const conflicts: any[] = data?.conflicts ?? [];

  const COL_COLORS: string[] = ['#FFD23F', '#52B788', '#FF7A30', '#8A8270', '#FF4D4D'];

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '22px 26px 40px' }}>
      <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: -0.6, marginBottom: 22 }}>
        Pertanahan &amp; Perizinan
      </div>

      {/* 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {kpis.map((k: any, i: number) => (
          <div key={i} style={{
            background: '#fff', border: '2.5px solid #141414', borderRadius: 13,
            boxShadow: '4px 4px 0 #141414', padding: 14,
          }}>
            <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginBottom: 3 }}>
              {(k.en ?? k.label).toUpperCase()}
            </div>
            <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 8 }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: -1 }}>{k.val}</span>
              <span className="mono" style={{ fontSize: 11, color: '#8A8270' }}>{k.unit}</span>
            </div>
            <div className="mono" style={{
              fontSize: 9, fontWeight: 700, color: '#fff',
              background: k.trend_bg || '#141414',
              border: '1.5px solid #141414', borderRadius: 4,
              padding: '1px 5px', display: 'inline-block', marginTop: 6,
            }}>{k.trend}</div>
          </div>
        ))}
      </div>

      {/* Kanban Pipeline */}
      <div style={{
        background: '#fff', border: '2.5px solid #141414', borderRadius: 13,
        boxShadow: '4px 4px 0 #141414', padding: 18, marginBottom: 20,
      }}>
        <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14 }}>Pipeline Pembebasan Lahan</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${parcelCols.length || 5}, 1fr)`, gap: 12 }}>
          {parcelCols.map((col: any, ci: number) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Column Header */}
              <div style={{
                background: COL_COLORS[ci % COL_COLORS.length],
                border: '2px solid #141414',
                borderRadius: 8,
                padding: '7px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontWeight: 800, fontSize: 10 }}>{col.title}</span>
                <span style={{
                  background: '#fff', border: '1.5px solid #141414',
                  borderRadius: 10, padding: '1px 6px',
                  fontSize: 9, fontWeight: 700, color: '#141414',
                }}>{col.count ?? col.items?.length ?? 0}</span>
              </div>
              {/* Cards */}
              {(col.items ?? []).map((item: any, ii: number) => (
                <div key={ii} style={{
                  background: '#FBF7EF', border: '1.5px solid #141414',
                  borderRadius: 7, padding: '8px 10px',
                  fontSize: 10, fontWeight: 600, lineHeight: 1.3,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>{item.name ?? item.title ?? item}</div>
                  {item.area && <div className="mono" style={{ fontSize: 8, color: '#8A8270' }}>{item.area} ha</div>}
                  {item.status && (
                    <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginTop: 2 }}>{item.status}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Permits + Conflicts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Permits */}
        <div style={{ background: '#fff', border: '2.5px solid #141414', borderRadius: 13, boxShadow: '4px 4px 0 #141414', padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14 }}>Status Izin &amp; Lisensi</div>
          {permits.map((p: any, i: number) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontWeight: 700, fontSize: 11 }}>{p.name}</span>
                <span className="mono" style={{ fontSize: 9, color: '#8A8270' }}>{p.expiry ?? p.deadline}</span>
              </div>
              <ProgressBar value={p.progress ?? p.pct ?? 0} color={p.color || '#52B788'} height={8} />
              <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginTop: 3 }}>
                {p.progress ?? p.pct ?? 0}% · {p.status}
              </div>
            </div>
          ))}
        </div>

        {/* Conflicts */}
        <div style={{ background: '#fff', border: '2.5px solid #141414', borderRadius: 13, boxShadow: '4px 4px 0 #141414', padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14 }}>Konflik Lahan</div>
          {conflicts.map((c: any, i: number) => (
            <div key={i} style={{
              borderLeft: `5px solid ${c.color || '#FF4D4D'}`,
              border: '2px solid #141414',
              borderRadius: 9, padding: '10px 12px', marginBottom: 9,
              boxShadow: '2px 2px 0 #141414',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 11, flex: 1 }}>{c.title ?? c.name}</span>
                <span className="mono" style={{
                  fontSize: 8, fontWeight: 700, color: '#fff',
                  background: c.color || '#FF4D4D',
                  border: '1.5px solid #141414', borderRadius: 4, padding: '2px 5px',
                }}>{c.severity ?? c.type ?? 'KONFLIK'}</span>
              </div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.4 }}>{c.description}</div>
              {c.area && (
                <div className="mono" style={{ fontSize: 8.5, color: '#8A8270', marginTop: 4 }}>Luas: {c.area} ha</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
