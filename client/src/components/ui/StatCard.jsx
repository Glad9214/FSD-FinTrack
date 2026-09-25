import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Animated count-up hook
function useCountUp(end, duration = 1200) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (typeof end !== 'number' || end === 0) {
      setCount(end || 0);
      return;
    }
    startTime.current = null;
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  trendLabel,
  prefix = '₹',
  suffix = '',
  delay = 0,
  loading = false,
}) {
  const animatedValue = useCountUp(typeof value === 'number' ? value : 0);

  const colorMap = {
    blue: {
      icon: '#3b82f6',
      iconBg: 'rgba(59,130,246,0.1)',
      value: 'var(--color-text-primary)',
    },
    emerald: {
      icon: '#10b981',
      iconBg: 'rgba(16,185,129,0.1)',
      value: '#10b981',
    },
    red: {
      icon: '#ef4444',
      iconBg: 'rgba(239,68,68,0.1)',
      value: '#ef4444',
    },
    amber: {
      icon: '#f59e0b',
      iconBg: 'rgba(245,158,11,0.1)',
      value: 'var(--color-text-primary)',
    },
    purple: {
      icon: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.1)',
      value: 'var(--color-text-primary)',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="skeleton" style={{ height: 40, width: 40, borderRadius: 10, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 28, width: '80%' }} />
      </div>
    );
  }

  return (
    <motion.div
      className="card"
      style={{ padding: '1.25rem' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: c.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color={c.icon} />
        </div>

        {trend !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trend >= 0 ? '#10b981' : '#ef4444',
              background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 4 }}>
        {title}
      </p>
      <p className="amount-large" style={{ color: c.value }}>
        {suffix ? '' : prefix}{animatedValue.toLocaleString('en-IN')}{suffix}
      </p>

      {trendLabel && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: 6 }}>{trendLabel}</p>
      )}
    </motion.div>
  );
}

export default StatCard;
