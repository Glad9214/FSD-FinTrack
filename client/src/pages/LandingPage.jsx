import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Wallet,
  Shield,
  Zap,
  ArrowUpRight,
  IndianRupee,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: IndianRupee,
    title: 'Track Every Rupee',
    description: 'Organize income and expenses by category. Know exactly where your money goes every month.',
  },
  {
    icon: Target,
    title: 'Stay Within Budget',
    description: 'Set monthly limits and monitor spending in real-time. Get alerts when you approach your cap.',
  },
  {
    icon: PieChart,
    title: 'Understand Your Spending',
    description: 'Visualize patterns with beautiful charts. Spot trends and make smarter financial decisions.',
  },
  {
    icon: BarChart3,
    title: 'Monthly Insights',
    description: 'Review your financial activity month by month. See top categories, budget usage, and more.',
  },
];

const heroStats = [
  { label: 'Income', value: '₹75,000', icon: TrendingUp, color: '#10b981', change: '+12%' },
  { label: 'Total Expenses', value: '₹48,750', icon: Wallet, color: '#ef4444', change: '-8%' },
  { label: 'Monthly Savings', value: '₹26,250', icon: ArrowUpRight, color: '#3b82f6', change: '+15%' },
];

const navLinks = ['Home', 'Features', 'About', 'Contact'];

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
      {/* ═══ Navigation ═══ */}
      <nav
        style={{
          padding: '0 2rem',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(5,11,24,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={16} color="white" />
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>FinTrack</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hide-mobile">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--color-text-primary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-secondary)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/login"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.4375rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              transition: 'color 0.15s',
            }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 5rem) 2rem',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 999,
              padding: '0.3125rem 0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#34d399',
            }}
          >
            <Zap size={12} />
            Your Financial Partner
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              color: 'var(--color-text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Take Control{' '}
            <br />
            of Your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Money.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: 460,
            }}
          >
            Track your income, expenses, budgets and spending patterns — all in one place.
            Build better habits, achieve your goals, and create the financial future you deserve.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#10b981',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 10,
                boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                transition: 'all 0.2s',
              }}
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Secure & Private', 'Easy to Use', 'Build a Better Future'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                <CheckCircle size={14} color="#10b981" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 20,
              padding: '1.5rem',
              position: 'relative',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Mini dashboard header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 2 }}>Total Balance</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
                  ₹ 48,250
                </p>
              </div>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, color: '#10b981',
                background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 999,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <ArrowUpRight size={12} />
                +15%
              </div>
            </div>

            {/* Stat rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--color-bg-elevated)',
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: `${s.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <s.icon size={16} color={s.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 1 }}>{s.label}</p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                        {s.value}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color }}>
                    {s.change}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Mini spending insights card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))',
                border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: 12,
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <PieChart size={14} color="#60a5fa" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa' }}>Spending Insights</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                See where your money goes with beautiful charts and insights.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ Features ═══ */}
      <section id="features" style={{ padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            FEATURES
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.025em',
              marginBottom: '0.5rem',
            }}
          >
            Everything You Need for{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 800 }}>Better Money Management</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: 520 }}>
            Powerful features to help you track, plan and grow your finances.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 14,
                padding: '1.5rem',
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              whileHover={{ y: -3, borderColor: 'var(--color-border-hover)' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: 'var(--color-blue-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <f.icon size={22} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '2rem 2rem 5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 700,
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.06))',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 20,
            padding: 'clamp(2rem, 5vw, 3rem)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}
          >
            Start tracking today
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            Join and take control of your spending. It's free and takes less than a minute.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {['No credit card required', 'Free to use', 'Secure & private'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                <CheckCircle size={13} color="#10b981" />
                {item}
              </div>
            ))}
          </div>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#3b82f6',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9375rem',
              padding: '0.75rem 1.75rem',
              borderRadius: 10,
              boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
            }}
          >
            Create Free Account
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={12} color="white" />
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>FinTrack</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
          © {new Date().getFullYear()} FinTrack. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Home', 'Features', 'About', 'Contact'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {link}
            </a>
          ))}
        </div>
      </footer>

      {/* Hide nav links on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          section:nth-of-type(1) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
