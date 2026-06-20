import { useDatasets, useConnectors } from '../api';

export default function M6DataHub() {
  const { data: datasets = [], isLoading: loadingDs, isError: errorDs } = useDatasets();
  const { data: connectors = [], isLoading: loadingCn } = useConnectors();

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '22px 26px 40px' }}>
      <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: -0.6, marginBottom: 22 }}>Data Hub · OGC &amp; ETL</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Dataset Catalog */}
        <div style={{ background: '#fff', border: '2.5px solid #141414', borderRadius: 13, boxShadow: '4px 4px 0 #141414', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '2.5px solid #141414', background: '#FBF7EF' }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>Katalog Dataset</div>
            <div className="mono" style={{ fontSize: 9, color: '#8A8270', marginTop: 2 }}>OGC WMS · WFS · WCS · COG</div>
          </div>
          {loadingDs ? (
            <div className="mono" style={{ padding: 20, fontSize: 10, color: '#8A8270' }}>Memuat...</div>
          ) : errorDs ? (
            <div style={{ margin: 16, padding: 12, background: '#FFFBEE', border: '2px solid #FFD23F', borderRadius: 9 }}>
              <div style={{ fontWeight: 800, fontSize: 12 }}>Gagal memuat data</div>
              <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 4 }}>
                Backend offline. <code>docker compose up -d</code>
              </div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FBF7EF', borderBottom: '2px solid #141414' }}>
                  {['DATASET', 'FORMAT', 'SIZE', 'CRS'].map(h => (
                    <th key={h} className="mono" style={{ padding: '8px 14px', fontSize: 8.5, fontWeight: 700, textAlign: 'left', color: '#8A8270' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasets.map((d: any, i: number) => (
                  <tr key={d.id ?? i} style={{ borderBottom: '1.5px solid #E6DFCD', background: i % 2 === 0 ? '#fff' : '#FDFAF5' }}>
                    <td style={{ padding: '9px 14px', fontWeight: 700, fontSize: 11 }}>{d.name}</td>
                    <td className="mono" style={{ padding: '9px 14px', fontSize: 10, color: '#141414' }}>
                      <span style={{
                        background: '#FBF7EF', border: '1.5px solid #141414',
                        borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 700,
                      }}>{d.format}</span>
                    </td>
                    <td className="mono" style={{ padding: '9px 14px', fontSize: 10, color: '#8A8270' }}>{d.size}</td>
                    <td className="mono" style={{ padding: '9px 14px', fontSize: 10, color: '#8A8270' }}>{d.crs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Connectors */}
        <div style={{ background: '#fff', border: '2.5px solid #141414', borderRadius: 13, boxShadow: '4px 4px 0 #141414', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '2.5px solid #141414', background: '#FBF7EF' }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>Konektor Data</div>
            <div className="mono" style={{ fontSize: 9, color: '#8A8270', marginTop: 2 }}>Live Connection · ETL Pipeline</div>
          </div>
          <div style={{ padding: 12 }}>
            {loadingCn ? (
              <div className="mono" style={{ fontSize: 10, color: '#8A8270', padding: 8 }}>Memuat...</div>
            ) : (
              connectors.map((c: any, i: number) => (
                <div key={c.id ?? i} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 12px',
                  border: '2px solid #141414',
                  borderRadius: 9, marginBottom: 8,
                  boxShadow: '2px 2px 0 #141414',
                }}>
                  {/* Status dot with pulse animation for active */}
                  <span style={{
                    width: 10, height: 10, flexShrink: 0,
                    borderRadius: '50%',
                    background: c.active ? '#52B788' : '#E6DFCD',
                    border: '2px solid #141414',
                    ...(c.active ? { animation: 'pulse 1.5s infinite' } : {}),
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{c.name}</div>
                    <div className="mono" style={{ fontSize: 9, color: '#8A8270' }}>{c.protocol}</div>
                  </div>
                  <span className="mono" style={{
                    fontSize: 8.5, fontWeight: 700,
                    color: c.active ? '#52B788' : '#8A8270',
                  }}>{c.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Inline keyframe style */}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  );
}
