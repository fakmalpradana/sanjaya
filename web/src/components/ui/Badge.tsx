interface BadgeProps { label: string; bg?: string; fg?: string; }

export function Badge({ label, bg = '#141414', fg = '#fff' }: BadgeProps) {
  return (
    <span
      className="mono"
      style={{
        fontSize: 8, fontWeight: 700, color: fg, background: bg,
        border: '1.5px solid #141414', borderRadius: 4,
        padding: '2px 6px', display: 'inline-block',
      }}
    >
      {label}
    </span>
  );
}
