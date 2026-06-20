interface CardProps { children: React.ReactNode; className?: string; style?: React.CSSProperties; }

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#fff',
        border: '2.5px solid #141414',
        borderRadius: 13,
        boxShadow: '4px 4px 0 #141414',
        padding: '16px 18px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
