import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { useEpochs } from '../api';
import type { ModuleId } from '../types';

const MODULE_BREADCRUMB: Record<ModuleId, { id: string; en: string }> = {
  M1: { id: 'Visualisasi 2D/3D',       en: 'Map · 2D/3D Visualization' },
  M2: { id: 'Stockpile & Volumetrik',   en: 'Stockpile · Volume per Epoch' },
  M3: { id: 'Pit Design',               en: 'Pit Design · Design-to-Actual' },
  M4: { id: 'Pemantauan Armada',        en: 'Fleet · Fuel & Efficiency' },
  M5: { id: 'Dashboard & Analitik',     en: 'Dashboard · Decision Support' },
  M6: { id: 'Data Hub',                 en: 'Data Hub · OGC · ETL' },
  M7: { id: 'Geoteknik & Keselamatan', en: 'Geotechnics · Slope Safety' },
  M8: { id: 'Pertanahan & Perizinan',   en: 'Land · Permits · WIUP' },
};

const MAP_MODULES: ModuleId[] = ['M1', 'M3', 'M4', 'M7'];

const ALL_ROLES = [
  { username: 'owner',      name: 'Pemilik Tambang',        role: 'owner',      role_en: 'Owner / Management',   initials: 'OW' },
  { username: 'ktt',        name: 'Kepala Teknik Tambang',  role: 'ktt',        role_en: 'KTT / Mine Manager',   initials: 'KT' },
  { username: 'surveyor',   name: 'Surveyor',               role: 'surveyor',   role_en: 'Surveyor',             initials: 'SV' },
  { username: 'planner',    name: 'Mine Plan Engineer',     role: 'planner',    role_en: 'Mine Plan Engineer',   initials: 'MP' },
  { username: 'dispatcher', name: 'Dispatcher',             role: 'dispatcher', role_en: 'Dispatcher / Operasi', initials: 'DS' },
  { username: 'geotech',    name: 'Geotech Engineer',       role: 'geotech',    role_en: 'Geotech Engineer',     initials: 'GT' },
  { username: 'land',       name: 'Tim Pembebasan Lahan',   role: 'land',       role_en: 'Tim Pembebasan Lahan', initials: 'LA' },
  { username: 'legal',      name: 'Tim Legal & Perizinan',  role: 'legal',      role_en: 'Tim Legal & Perizinan',initials: 'LG' },
  { username: 'auditor',    name: 'Inspektur/Auditor',      role: 'auditor',    role_en: 'Inspektur / Auditor',  initials: 'AU' },
];

export function Topbar() {
  const activeModule = useStore(s => s.activeModule);
  const viewMode = useStore(s => s.viewMode);
  const epochIndex = useStore(s => s.epochIndex);
  const user = useStore(s => s.user);
  const token = useStore(s => s.token);
  const { data: epochs = [] } = useEpochs();
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  const breadcrumb = MODULE_BREADCRUMB[activeModule];
  const currentEpoch = epochs[epochIndex];
  const showViewToggle = MAP_MODULES.includes(activeModule);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleRoleSelect(r: typeof ALL_ROLES[0]) {
    useStore.getState().login(
      { ...r, id: r.role.charCodeAt(0) },
      token ?? 'demo-token'
    );
    setRoleOpen(false);
  }

  const initials = user?.initials ?? (user?.name?.slice(0, 2).toUpperCase() ?? 'US');
  const userName = user?.name ?? 'User';
  const userRoleEn = user?.role_en ?? '';

  return (
    <div style={{
      height: 60,
      background: '#fff',
      borderBottom: '2.5px solid #141414',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 16px',
      zIndex: 30,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        width: 38, height: 38,
        background: '#FFD23F',
        border: '2.5px solid #141414',
        borderRadius: 9,
        boxShadow: '2px 2px 0 #141414',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 15, flexShrink: 0,
      }}>SJ</div>

      {/* Brand */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontWeight: 900, fontSize: 15, lineHeight: 1, letterSpacing: -0.3 }}>SANJAYA</div>
        <div className="mono" style={{ fontSize: 8, color: '#8A8270', fontWeight: 700, marginTop: 1 }}>WEBGIS · TAMBANG BATU BARA</div>
      </div>

      {/* Divider */}
      <div style={{ width: 2, height: 30, background: '#E6DFCD', flexShrink: 0 }} />

      {/* Breadcrumb */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{breadcrumb.id}</div>
        <div className="mono" style={{ fontSize: 9, color: '#8A8270', marginTop: 1 }}>{breadcrumb.en}</div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* 2D/3D Toggle */}
        {showViewToggle && (
          <div style={{ display: 'flex', flexShrink: 0 }}>
            <button
              onClick={() => useStore.getState().setView('2D')}
              style={{
                fontWeight: 800, fontSize: 12, padding: '7px 13px',
                border: '2.5px solid #141414',
                borderRight: '1.25px solid #141414',
                borderRadius: '9px 0 0 9px',
                boxShadow: viewMode === '2D' ? '2px 2px 0 #141414' : 'none',
                background: viewMode === '2D' ? '#FFD23F' : '#fff',
                cursor: 'pointer',
              }}
            >2D</button>
            <button
              onClick={() => useStore.getState().setView('3D')}
              style={{
                fontWeight: 800, fontSize: 12, padding: '7px 13px',
                border: '2.5px solid #141414',
                borderLeft: '1.25px solid #141414',
                borderRadius: '0 9px 9px 0',
                boxShadow: viewMode === '3D' ? '2px 2px 0 #141414' : 'none',
                background: viewMode === '3D' ? '#FFD23F' : '#fff',
                cursor: 'pointer',
              }}
            >3D</button>
          </div>
        )}

        {/* Epoch badge */}
        <div className="mono" style={{
          fontSize: 11, fontWeight: 700,
          background: '#FBF7EF',
          border: '2.5px solid #141414',
          borderRadius: 8,
          padding: '6px 11px',
          boxShadow: '2px 2px 0 #141414',
          display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52B788', display: 'inline-block' }} />
          {currentEpoch?.label ?? "Jan '26"}
        </div>

        {/* Bell button */}
        <button style={{
          width: 40, height: 40,
          border: '2.5px solid #141414',
          borderRadius: 9,
          boxShadow: '2px 2px 0 #141414',
          background: '#fff',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', flexShrink: 0,
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 17, height: 17,
            background: '#FF4D4D', border: '2px solid #fff',
            borderRadius: '50%',
            fontSize: 9, fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} className="mono">3</span>
        </button>

        {/* Role switcher */}
        <div ref={roleRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setRoleOpen(v => !v)}
            style={{
              background: '#141414',
              border: '2.5px solid #141414',
              borderRadius: 9,
              boxShadow: '2px 2px 0 #FFD23F',
              padding: '6px 10px 6px 7px',
              display: 'flex', alignItems: 'center', gap: 7,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 28, height: 28,
              background: '#FFD23F',
              border: '2px solid #fff',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 12, color: '#141414',
            }}>{initials}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 12, color: '#fff', lineHeight: 1 }}>{userName}</div>
              <div className="mono" style={{ fontSize: 8.5, color: '#BDB6A4', marginTop: 1 }}>{userRoleEn}</div>
            </div>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#BDB6A4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {roleOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff',
              border: '2.5px solid #141414',
              borderRadius: 12,
              boxShadow: '6px 6px 0 #141414',
              padding: 8,
              zIndex: 50,
              width: 288,
            }}>
              <div className="mono" style={{ fontSize: 9, color: '#8A8270', fontWeight: 700, padding: '4px 8px 8px', letterSpacing: 0.5 }}>
                PILIH PERAN · SWITCH ROLE
              </div>
              {ALL_ROLES.map(r => (
                <button
                  key={r.username}
                  onClick={() => handleRoleSelect(r)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 9px', border: 'none', background: 'transparent',
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FBF7EF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 30, height: 30, flexShrink: 0,
                    background: user?.username === r.username ? '#FFD23F' : '#F2EAD8',
                    border: '2px solid #141414',
                    borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 11,
                  }}>{r.initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1 }}>{r.name}</div>
                    <div className="mono" style={{ fontSize: 9, color: '#8A8270', marginTop: 1 }}>{r.role_en}</div>
                  </div>
                  {user?.username === r.username && (
                    <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
