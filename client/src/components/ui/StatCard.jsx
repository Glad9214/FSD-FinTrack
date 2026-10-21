import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Animated count-up hook
function useCountUp(end, duration = 1500) {
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
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
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
  prevValue,
}) {
  const animatedValue = useCountUp(typeof value === 'number' ? value : 0);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth 3D tilt using framer-motion springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  // Spotlight effect
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const colorMap = {
    blue: {
      icon: '#3b82f6',
      iconBg: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(6,182,212,0.08))',
      border: 'rgba(59,130,246,0.25)',
      glow: 'rgba(59,130,246,0.15)',
      value: 'var(--color-text-primary)',
      spotlight: 'rgba(59,130,246,0.1)',
    },
    emerald: {
      icon: '#10b981',
      iconBg: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(52,211,153,0.08))',
      border: 'rgba(16,185,129,0.25)',
      glow: 'rgba(16,185,129,0.15)',
      value: '#10b981',
      spotlight: 'rgba(16,185,129,0.1)',
    },
    red: {
      icon: '#ef4444',
      iconBg: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(248,113,113,0.08))',
      border: 'rgba(239,68,68,0.25)',
      glow: 'rgba(239,68,68,0.15)',
      value: '#ef4444',
      spotlight: 'rgba(239,68,68,0.1)',
    },
    amber: {
      icon: '#f59e0b',
      iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(251,191,36,0.08))',
      border: 'rgba(245,158,11,0.25)',
      glow: 'rgba(245,158,11,0.15)',
      value: 'var(--color-text-primary)',
      spotlight: 'rgba(245,158,11,0.1)',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  // Calculate trend from previous value if available
  let computedTrend = trend;
  if (computedTrend === undefined && prevValue !== undefined && prevValue > 0) {
    computedTrend = Math.round(((value - prevValue) / prevValue) * 100);
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="skeleton" style={{ height: 42, width: 42, borderRadius: 12, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 28, width: '70%' }} />
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="card"
      style={{
        padding: '1.25rem',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        rotateX,
        rotateY,
        transformPerspective: 1000,
        zIndex: isHovered ? 10 : 1,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, boxShadow: `0 12px 30px -10px ${c.glow}` }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Dynamic Spotlight on Hover */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${spotlightX.get()} ${spotlightY.get()}, ${c.spotlight}, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, position: 'relative', zIndex: 2 }}>
        <motion.div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: c.iconBg,
            border: `1px solid ${c.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${c.glow}`,
          }}
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1, transition: { duration: 0.5 } }}
        >
          <Icon size={20} color={c.icon} />
        </motion.div>

        {computedTrend !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: computedTrend >= 0 ? '#10b981' : '#ef4444',
              background: computedTrend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              padding: '3px 8px',
              borderRadius: 999,
              border: `1px solid ${computedTrend >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              boxShadow: computedTrend >= 0 ? '0 2px 8px rgba(16,185,129,0.15)' : '0 2px 8px rgba(239,68,68,0.15)',
            }}
          >
            {computedTrend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(computedTrend)}%
          </motion.div>
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 4 }}>
          {title}
        </p>
        <motion.p 
          className="amount-large" 
          style={{ color: c.value, fontSize: 'clamp(1.375rem, 2.5vw, 1.75rem)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
        >
          {suffix ? '' : prefix}{animatedValue.toLocaleString('en-IN')}{suffix}
        </motion.p>

        {trendLabel && (
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', marginTop: 6, fontWeight: 500 }}>{trendLabel}</p>
        )}
      </div>

      {/* Subtle corner glow */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.glow}, transparent 70%)`,
        pointerEvents: 'none',
        opacity: 0.6,
      }} />
    </motion.div>
  );
}

export default StatCard;
