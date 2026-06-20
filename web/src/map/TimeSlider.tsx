import { useEpochs } from '../api';
import { useStore } from '../store';

export function TimeSlider() {
  const { data: epochs = [] } = useEpochs();
  const epochIndex = useStore(s => s.epochIndex);
  const setEpoch = useStore(s => s.setEpoch);
  const currentEpoch = epochs[epochIndex];

  const fillPct = epochs.length > 1 ? (epochIndex / (epochs.length - 1)) * 100 : 0;

  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(660px, 60vw)',
      background: '#fff',
      border: '2.5px solid #141414',
      borderRadius: 12,
      boxShadow: '4px 4px 0 #141414',
      padding: '10px 16px 12px',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <button style={{
          width: 26, height: 26,
          border: '2px solid #141414',
          borderRadius: 7,
          background: '#FFD23F',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="#141414">
            <path d="M6 4l14 8-14 8z" />
          </svg>
        </button>
        <span style={{ fontWeight: 800, fontSize: 11 }}>Time Machine · Multi-Temporal</span>
        <span className="mono" style={{ marginLeft: 'auto', fontSize: 9, color: '#8A8270' }}>
          {currentEpoch?.date ?? '—'}
        </span>
      </div>

      <div style={{ position: 'relative', height: 34 }}>
        {/* Track */}
        <div style={{ position: 'absolute', top: 6, left: 8, right: 8, height: 3, background: '#141414' }} />
        {/* Fill */}
        <div style={{
          position: 'absolute', top: 6, left: 8,
          width: `${fillPct}%`,
          height: 3,
          background: '#FFD23F',
        }} />
        {/* Dots */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', justifyContent: 'space-between',
          padding: '0 8px',
        }}>
          {epochs.map((e: any, i: number) => (
            <button
              key={e.id}
              onClick={() => setEpoch(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                border: 'none', background: 'transparent', cursor: 'pointer', width: 34,
              }}
            >
              <span style={{
                width: i === epochIndex ? 14 : 10,
                height: i === epochIndex ? 14 : 10,
                borderRadius: '50%',
                background: i === epochIndex ? '#FFD23F' : '#fff',
                border: '2.5px solid #141414',
                marginTop: i === epochIndex ? 0 : 2,
                transition: 'all 0.15s',
                display: 'inline-block',
              }} />
              <span className="mono" style={{
                fontSize: 8.5, fontWeight: 700,
                color: i === epochIndex ? '#141414' : '#8A8270',
              }}>{e.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
