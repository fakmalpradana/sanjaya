interface ProgressBarProps { value: number; color?: string; height?: number; }

export function ProgressBar({ value, color = '#FFD23F', height = 11 }: ProgressBarProps) {
  return (
    <div style={{ height, border: '2px solid #141414', borderRadius: 6, overflow: 'hidden', background: '#FBF7EF' }}>
      <div style={{
        width: `${Math.min(100, value)}%`,
        height: '100%',
        background: color,
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}
