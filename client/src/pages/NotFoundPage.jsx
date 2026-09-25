import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Home, ArrowLeft } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const glowVariants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    scale: [1, 1.06, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function NotFoundPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        background: '#060D1A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Background glow */}
      <motion.div
        variants={glowVariants}
        animate="animate"
        style={{
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Logo ── */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(59,130,246,0.4)',
          }}
        >
          <TrendingUp size={24} color="#fff" />
        </div>
        <span
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          FinanceTracker
        </span>
      </motion.div>

      {/* ── 404 Number ── */}
      <motion.div variants={itemVariants}>
        <p
          style={{
            margin: '0 0 0.25rem',
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
            filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.3))',
          }}
        >
          404
        </p>
      </motion.div>

      {/* ── Heading ── */}
      <motion.h1
        variants={itemVariants}
        style={{
          margin: '0 0 0.75rem',
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 700,
          color: '#F9FAFB',
          letterSpacing: '-0.02em',
        }}
      >
        Page not found
      </motion.h1>

      {/* ── Supporting text ── */}
      <motion.p
        variants={itemVariants}
        style={{
          margin: '0 0 2.5rem',
          color: '#6B7280',
          fontSize: '1rem',
          lineHeight: 1.65,
          maxWidth: 380,
        }}
      >
        Oops! The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </motion.p>

      {/* ── Action Links ── */}
      <motion.div
        variants={itemVariants}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center' }}
      >
        {/* Primary – Dashboard */}
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            borderRadius: 12,
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.925rem',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <TrendingUp size={17} />
          Go to Dashboard
        </Link>

        {/* Secondary – Home */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px solid #1F2937',
            borderRadius: 12,
            color: '#9CA3AF',
            fontWeight: 600,
            fontSize: '0.925rem',
            textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3B82F6';
            e.currentTarget.style.color = '#60A5FA';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1F2937';
            e.currentTarget.style.color = '#9CA3AF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Home size={17} />
          Back to Home
        </Link>
      </motion.div>

      {/* Decorative dots */}
      <motion.div
        variants={itemVariants}
        style={{
          marginTop: '3.5rem',
          display: 'flex',
          gap: '0.4rem',
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: i === 1 ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === 1
                ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                : '#1F2937',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
