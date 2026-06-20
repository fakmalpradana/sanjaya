import { useState } from 'react';

const TOOLS = [
  { label: 'Jarak',       icon: 'M6 6l12 12M6 18L18 6' },
  { label: 'Luas',        icon: 'M3 3h18v18H3z' },
  { label: 'Beda Tinggi', icon: 'M3 12h18M12 3l9 9-9 9' },
  { label: 'Profil',      icon: 'M3 17l4-8 4 4 4-6 4 3' },
  { label: 'Koordinat',   icon: 'M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z' },
];

export function MeasureTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <div style={{
      position: 'absolute', top: 16, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      display: 'flex',
      gap: 6,
      background: '#fff',
      border: '2.5px solid #141414',
      borderRadius: 11,
      boxShadow: '4px 4px 0 #141414',
      padding: 6,
    }}>
      {TOOLS.map(t => {
        const isActive = activeTool === t.label;
        return (
          <button
            key={t.label}
            onClick={() => setActiveTool(isActive ? null : t.label)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              border: '2px solid #141414',
              borderRadius: 8,
              background: isActive ? '#FFD23F' : '#fff',
              padding: '6px 9px',
              minWidth: 52,
              cursor: 'pointer',
              boxShadow: isActive ? '2px 2px 0 #141414' : 'none',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
            <span style={{ fontSize: 8.5, fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
