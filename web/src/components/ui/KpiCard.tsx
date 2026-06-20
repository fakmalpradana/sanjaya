interface KpiCardProps {
  label: string;
  en: string;
  val: string;
  unit: string;
  trend: string;
  trendBg: string;
  sub: string;
  color: string;
}

export function KpiCard({ label, en, val, unit, trend, trendBg, sub, color }: KpiCardProps) {
  return (
    <div style={{
      background: '#fff',
      border: '2.5px solid #141414',
      borderRadius: 13,
      boxShadow: '4px 4px 0 #141414',
      padding: 13,
      minHeight: 118,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="mono" style={{ fontSize: 8.5, fontWeight: 700, color: '#8A8270', letterSpacing: 0.3 }}>{en}</span>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: color, border: '2px solid #141414', display: 'inline-block' }} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 11, marginTop: 3 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 'auto' }}>
        <span style={{ fontWeight: 900, fontSize: 27, letterSpacing: -1 }}>{val}</span>
        <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: '#8A8270' }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
        <span className="mono" style={{
          fontSize: 9, fontWeight: 700, color: '#fff',
          background: trendBg, border: '1.5px solid #141414',
          borderRadius: 4, padding: '1px 5px',
        }}>{trend}</span>
        <span className="mono" style={{ fontSize: 8.5, color: '#8A8270' }}>{sub}</span>
      </div>
    </div>
  );
}
