import type { Alert } from '../../types';
import { Badge } from './Badge';

interface AlertItemProps { alert: Alert; }

const SEV_BG: Record<string, string> = {
  KRITIS: '#FF4D4D',
  TINGGI: '#FF7A30',
  SEDANG: '#FFD23F',
};
const SEV_FG: Record<string, string> = {
  KRITIS: '#fff',
  TINGGI: '#fff',
  SEDANG: '#141414',
};

export function AlertItem({ alert }: AlertItemProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '10px 12px',
      borderRadius: 10,
      background: alert.bg_tint || '#fff',
      border: '2px solid #141414',
      boxShadow: '2px 2px 0 #141414',
      marginBottom: 8,
    }}>
      <div style={{
        width: 7, flexShrink: 0, borderRadius: 4,
        background: alert.color || SEV_BG[alert.severity] || '#ccc',
        alignSelf: 'stretch',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <Badge
            label={alert.severity}
            bg={SEV_BG[alert.severity] || '#141414'}
            fg={SEV_FG[alert.severity] || '#fff'}
          />
          <Badge label={alert.module} bg="#141414" fg="#fff" />
          <span className="mono" style={{ fontSize: 8, color: '#8A8270', marginLeft: 'auto' }}>{alert.time_ago}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{alert.title}</div>
        <div style={{ fontSize: 11, color: '#555' }}>{alert.description}</div>
      </div>
    </div>
  );
}
