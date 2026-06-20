import { useStore } from '../store';
import type { ModuleId } from '../types';

const MODULES: { id: ModuleId; label: string; code: string; icon: React.ReactNode }[] = [
  {
    id: 'M1',
    label: 'Visualisasi',
    code: 'VIZ · 2D/3D',
    icon: (
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    ),
  },
  {
    id: 'M2',
    label: 'Stockpile',
    code: 'VOL · EPOCH',
    icon: (
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
  },
  {
    id: 'M3',
    label: 'Pit Design',
    code: 'DESIGN · ACT',
    icon: <path d="M3 7h18M3 12h18M3 17h18" />,
  },
  {
    id: 'M4',
    label: 'Armada',
    code: 'FLEET · BBM',
    icon: (
      <>
        <path d="M8 17H5a2 2 0 01-2-2V9a2 2 0 012-2h11.586a2 2 0 011.414.586l2.414 2.414A2 2 0 0122 11.414V15a2 2 0 01-2 2h-3" />
        <circle cx="9" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
  },
  {
    id: 'M5',
    label: 'Dashboard',
    code: 'KPI · DSS',
    icon: (
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
  {
    id: 'M6',
    label: 'Data Hub',
    code: 'OGC · ETL',
    icon: (
      <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    ),
  },
  {
    id: 'M7',
    label: 'Geoteknik',
    code: 'FK · PK',
    icon: (
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    id: 'M8',
    label: 'Pertanahan',
    code: 'LAND · IUP',
    icon: (
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    ),
  },
];

export function ModuleRail() {
  const activeModule = useStore(s => s.activeModule);
  const setModule = useStore(s => s.setModule);

  return (
    <div style={{
      width: 88,
      background: '#fff',
      borderRight: '2.5px solid #141414',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0',
      gap: 9,
      overflowY: 'auto',
      zIndex: 20,
      flexShrink: 0,
    }}>
      {MODULES.map(m => {
        const isActive = activeModule === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setModule(m.id)}
            style={{
              width: 68,
              padding: '9px 4px 7px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              border: '2.5px solid #141414',
              borderRadius: 11,
              background: isActive ? '#FFD23F' : '#fff',
              boxShadow: isActive ? '3px 3px 0 #141414' : '2px 2px 0 #141414',
              cursor: 'pointer',
              transition: 'background 0.12s, box-shadow 0.12s',
            }}
          >
            <svg
              width={23} height={23}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#141414"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {m.icon}
            </svg>
            <span style={{ fontSize: 9.5, fontWeight: 800, lineHeight: 1, textAlign: 'center' }}>{m.label}</span>
            <span className="mono" style={{ fontSize: 7, color: '#8A8270', lineHeight: 1, textAlign: 'center' }}>{m.code}</span>
          </button>
        );
      })}
    </div>
  );
}
