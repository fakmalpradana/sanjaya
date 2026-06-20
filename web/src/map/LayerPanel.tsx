import { useLayers } from '../api';

export function LayerPanel() {
  const { data: layers = [] } = useLayers();
  return (
    <div style={{
      position: 'absolute', top: 16, left: 16, width: 212,
      background: '#fff',
      border: '2.5px solid #141414',
      borderRadius: 12,
      boxShadow: '4px 4px 0 #141414',
      overflow: 'hidden',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 12px',
        borderBottom: '2.5px solid #141414',
        background: '#FBF7EF',
      }}>
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m12.8 2.2 8.6 3.9a1 1 0 0 1 0 1.8l-8.6 3.9a2 2 0 0 1-1.6 0L2.6 7.9a1 1 0 0 1 0-1.8l8.6-3.9a2 2 0 0 1 1.6 0Z" />
          <path d="m22 17-9.4 4.3a2 2 0 0 1-1.6 0L2 17" />
          <path d="m22 12-9.4 4.3a2 2 0 0 1-1.6 0L2 12" />
        </svg>
        <span style={{ fontWeight: 800, fontSize: 12 }}>Layers</span>
        <span className="mono" style={{ marginLeft: 'auto', fontSize: 8.5, color: '#8A8270' }}>
          {layers.filter((l: any) => l.active).length}/{layers.length}
        </span>
      </div>
      <div style={{ padding: 7 }}>
        {layers.length === 0 ? (
          <div className="mono" style={{ fontSize: 10, color: '#8A8270', padding: '6px 4px' }}>
            Tidak ada layer
          </div>
        ) : (
          layers.map((l: any) => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px', borderRadius: 6 }}>
              {/* Toggle switch */}
              <span style={{
                width: 30, height: 17, flex: 'none',
                border: '2px solid #141414',
                borderRadius: 11,
                background: l.active ? '#FFD23F' : '#E6DFCD',
                position: 'relative',
                display: 'inline-block',
              }}>
                <span style={{
                  position: 'absolute', top: 1,
                  left: l.active ? 13 : 1,
                  width: 11, height: 11,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '1.5px solid #141414',
                  transition: 'left .15s',
                }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: l.active ? '#141414' : '#8A8270' }}>{l.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
