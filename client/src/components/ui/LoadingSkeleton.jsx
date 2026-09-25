function LoadingSkeleton({ rows = 3, showHeader = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showHeader && (
        <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 8 }} />
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton" style={{ height: 13, width: `${60 + Math.random() * 30}%` }} />
            <div className="skeleton" style={{ height: 11, width: `${30 + Math.random() * 20}%` }} />
          </div>
          <div className="skeleton" style={{ width: 70, height: 18, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ lines = 2 }) {
  return (
    <div className="card p-5">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 44, width: 44, borderRadius: 10, marginBottom: 4 }} />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 14, width: i === 0 ? '50%' : '75%' }} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
