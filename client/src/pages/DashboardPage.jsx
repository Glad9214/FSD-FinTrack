import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, transactionsAPI, budgetAPI } from '../services/api';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatDateRelative, getCategoryColor, getBudgetStatus, getInitials, formatDateFull } from '../utils/formatters';
import { MONTH_NAMES, CATEGORY_COLORS, CHART_COLORS } from '../styles/theme';
import {
  Wallet, TrendingUp, TrendingDown, Target, ArrowRight,
  PlusCircle, BarChart3, ArrowUpRight, ArrowDownRight,
  UtensilsCrossed, BookOpen, Car, ShoppingBag, Receipt,
  Tv, Heart, RefreshCw, MoreHorizontal, Briefcase, Code2, Gift, DollarSign,
  Zap, Lightbulb, Shield, ChevronRight, Clock, Sparkles,
  CircleDollarSign, PiggyBank, LineChart, CreditCard,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area, Line, LineChart as ReLineChart, Sector
} from 'recharts';

const ICON_MAP = {
  'Food': UtensilsCrossed, 'Books / Education': BookOpen, 'Travel': Car,
  'Shopping': ShoppingBag, 'Bills': Receipt, 'Entertainment': Tv,
  'Health': Heart, 'Subscriptions': RefreshCw, 'Others': MoreHorizontal,
  'Salary': Briefcase, 'Freelance': Code2, 'Allowance': Gift, 'Other': DollarSign,
};

/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SECTION — Cinematic Fintech Greeting
   ═══════════════════════════════════════════════════════════════════════════════ */

function HeroSection({ greeting, firstName, monthName, year, now, budgetUsed, budgetAmount, healthScore, healthStatus, totalIncome, totalExpenses }) {
  const heroRef = useRef(null);

  const animatedScore = useSpring(0, { damping: 20, stiffness: 100 });
  const displayScore = useTransform(animatedScore, Math.round);

  useEffect(() => {
    animatedScore.set(healthScore);
  }, [healthScore, animatedScore]);

  const getHeroMessage = () => {
    if (budgetAmount === 0 && totalIncome === 0 && totalExpenses === 0) {
      return "Start tracking to see your financial health.";
    }
    if (healthScore >= 80) return "Your finances are looking great.";
    if (healthScore >= 60) return "You are making steady progress.";
    if (healthScore >= 40) return "A few tweaks could boost your savings.";
    return "Your spending needs attention.";
  };

  // Smooth Parallax setup using Framer Motion
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 40, stiffness: 120, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  // Transforms for parallax depth
  const bgTranslateX = useTransform(smoothX, [0, 1], ['-1%', '1%']);
  const bgTranslateY = useTransform(smoothY, [0, 1], ['-1%', '1%']);
  const mountainTranslateX = useTransform(smoothX, [0, 1], ['-2%', '2%']);
  const mountainTranslateY = useTransform(smoothY, [0, 1], ['1%', '-1%']);
  
  const orb1X = useTransform(smoothX, [0, 1], ['15%', '-15%']);
  const orb1Y = useTransform(smoothY, [0, 1], ['15%', '-15%']);
  const orb2X = useTransform(smoothX, [0, 1], ['-15%', '15%']);
  const orb2Y = useTransform(smoothY, [0, 1], ['-15%', '15%']);

  const cardRotateY = useTransform(smoothX, [0, 1], ['-18deg', '18deg']);
  const cardRotateX = useTransform(smoothY, [0, 1], ['18deg', '-18deg']);
  const cardTranslateX = useTransform(smoothX, [0, 1], ['-30px', '30px']);
  const cardTranslateY = useTransform(smoothY, [0, 1], ['-20px', '20px']);
  
  const coin1X = useTransform(smoothX, [0, 1], ['-45px', '45px']);
  const coin1Y = useTransform(smoothY, [0, 1], ['-35px', '35px']);
  const coin2X = useTransform(smoothX, [0, 1], ['35px', '-35px']);
  const coin2Y = useTransform(smoothY, [0, 1], ['30px', '-30px']);
  const float1X = useTransform(smoothX, [0, 1], ['-20px', '20px']);
  const float1Y = useTransform(smoothY, [0, 1], ['25px', '-25px']);
  const float2X = useTransform(smoothX, [0, 1], ['40px', '-40px']);
  const float2Y = useTransform(smoothY, [0, 1], ['-20px', '20px']);
  const float3X = useTransform(smoothX, [0, 1], ['-35px', '35px']);
  const float3Y = useTransform(smoothY, [0, 1], ['-30px', '30px']);

  const contentTranslateX = useTransform(smoothX, [0, 1], ['-5px', '5px']);
  const contentTranslateY = useTransform(smoothY, [0, 1], ['-5px', '5px']);

  const day = now.getDate();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return (
    <motion.div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 90, damping: 20 }}
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        padding: '1.75rem 2.25rem 1.5rem',
        minHeight: 200,
        background: 'linear-gradient(135deg, rgba(8, 16, 42, 0.95), rgba(4, 10, 28, 0.98))',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: 'default',
        perspective: 1200,
      }}
    >
      {/* Animated background layers */}
      <motion.div style={{
        position: 'absolute', inset: -20, overflow: 'hidden', pointerEvents: 'none',
        x: bgTranslateX, y: bgTranslateY,
      }}>
        
        {/* Subtle 3D Perspective Grid */}
        <div style={{
          position: 'absolute',
          bottom: '-30%', left: '-50%', right: '-50%', height: '80%',
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.04) 1px, transparent 1px)',
          transform: 'perspective(600px) rotateX(70deg)',
          transformOrigin: 'top center',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
        }} />

        {/* Animated stars/particles floating up */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              backgroundColor: i % 2 === 0 ? '#60a5fa' : '#22d3ee',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              bottom: '-5%',
              opacity: 0,
            }}
            animate={{
              y: [0, -300],
              opacity: [0, Math.random() * 0.6 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Mountain silhouette with Parallax */}
        <motion.svg 
          style={{ position: 'absolute', bottom: -10, left: -20, width: '110%', height: '75%', opacity: 0.15, x: mountainTranslateX, y: mountainTranslateY }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,120 L40,80 L80,95 L130,50 L180,70 L220,30 L270,55 L320,20 L370,45 L420,15 L470,40 L520,60 L560,35 L600,50 L600,120 Z" fill="url(#mountainGrad)" />
        </motion.svg>

        {/* Glowing horizon line */}
        <motion.div style={{
          position: 'absolute',
          bottom: '30%',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.5), rgba(16, 185, 129, 0.3), transparent)',
          filter: 'blur(2px)',
          y: mountainTranslateY,
        }} 
        animate={{ opacity: [0.5, 0.8, 0.5], scaleX: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Atmospheric gradient orbs */}
        <motion.div style={{
          position: 'absolute',
          width: 320,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.08), transparent 70%)',
          top: '5%',
          right: '-5%',
          x: orb1X,
          y: orb1Y,
        }} />
        <motion.div style={{
          position: 'absolute',
          width: 240,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.06), transparent 70%)',
          bottom: '0%',
          left: '15%',
          x: orb2X,
          y: orb2Y,
        }} />

        {/* Slow-moving financial light trails */}
        <motion.svg style={{ position: 'absolute', bottom: '28%', left: '38%', width: '55%', height: '40%', opacity: 0.25, x: mountainTranslateX, y: mountainTranslateY }}>
          <motion.path
            d="M0,80 Q50,60 100,65 T200,40 T300,25 T380,10"
            fill="none"
            stroke="url(#heroGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: [0, 1, 1], pathOffset: [1, 0, -1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          />
          <motion.path
            d="M20,90 Q70,70 120,75 T220,50 T320,35 T400,20"
            fill="none"
            stroke="url(#heroGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: [0, 1, 1], pathOffset: [1, 0, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2, repeatDelay: 0.5 }}
          />
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#d946ef" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>

      {/* 3D Floating Digital Card */}
      <motion.div
        style={{
          position: 'absolute',
          right: '25%',
          top: '25%',
          width: 110,
          height: 68,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${healthStatus.color}26, ${healthStatus.color}1a)`,
          border: `1px solid ${healthStatus.color}40`,
          backdropFilter: 'blur(10px)',
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: `0 10px 30px -10px ${healthStatus.color}4d`,
          x: cardTranslateX,
          y: cardTranslateY,
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          transformStyle: 'preserve-3d',
          zIndex: 5,
        }}
        animate={{
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, transform: 'translateZ(15px)' }}>
          <CreditCard size={10} color={healthStatus.color} />
          <span style={{ fontSize: 6, color: '#e2e8f0', fontWeight: 700, letterSpacing: '0.05em' }}>DIGITAL CARD</span>
        </div>
        <div style={{ display: 'flex', gap: 3, transform: 'translateZ(10px)' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: `${healthStatus.color}99`, boxShadow: `0 0 4px ${healthStatus.color}66` }} />
          ))}
        </div>
        <div style={{ fontSize: 6, color: '#94a3b8', fontWeight: 600, transform: 'translateZ(5px)' }}>Plan • Save • Grow</div>
        
        {/* Card glare effect */}
        <motion.div 
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 25%, transparent 30%)', backgroundSize: '200% 100%' }}
          animate={{ backgroundPosition: ['200% 0', '-100% 0'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
      </motion.div>

      {/* Floating 3D Elements */}
      <motion.div
        style={{
          position: 'absolute', right: '15%', bottom: '22%',
          width: 26, height: 26, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: '1px solid #fbbf24',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          x: coin1X, y: coin1Y,
          zIndex: 6,
        }}
        animate={{ y: ['-10%', '10%', '-10%'], rotateY: [0, 360], rotateZ: [-10, 10, -10] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>₹</span>
      </motion.div>

      <motion.div
        style={{
          position: 'absolute', right: '35%', top: '10%',
          width: 14, height: 14, borderRadius: '50%',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          border: '1px solid #fcd34d',
          boxShadow: '0 3px 10px rgba(245, 158, 11, 0.3), inset 0 1px 3px rgba(255,255,255,0.4)',
          x: coin2X, y: coin2Y,
          zIndex: 4,
        }}
        animate={{ y: ['5%', '-5%', '5%'], rotateX: [0, 360] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        style={{
          position: 'absolute', right: '8%', top: '35%',
          width: 32, height: 32, borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          x: float1X, y: float1Y,
          zIndex: 5,
        }}
        animate={{ y: ['-8%', '8%', '-8%'], rotateZ: [-5, 5, -5] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <TrendingUp size={16} color="#34d399" />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute', right: '40%', bottom: '15%',
          width: 24, height: 24, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          x: float2X, y: float2Y,
          zIndex: 3,
        }}
        animate={{ y: ['6%', '-6%', '6%'], rotateZ: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 8px #60a5fa' }} />
      </motion.div>

      {/* Foreground Content */}
      <motion.div style={{ position: 'relative', zIndex: 10, x: contentTranslateX, y: contentTranslateY }}>
        <motion.h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 6,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        >
          {greeting},<br />
          {firstName}
        </motion.h1>

        <motion.p
          style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: 360, lineHeight: 1.6, fontWeight: 500 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Small steps today, big goals tomorrow.
          <br />{getHeroMessage()}
        </motion.p>

        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, backgroundColor: `${healthStatus.color}20` }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: `${healthStatus.color}15`,
              border: `1px solid ${healthStatus.color}30`,
              borderRadius: 999, padding: '5px 12px',
              cursor: 'default', backdropFilter: 'blur(4px)',
              boxShadow: `0 0 10px ${healthStatus.color}15`,
            }}
            animate={{ boxShadow: [`0 0 5px ${healthStatus.color}10`, `0 0 15px ${healthStatus.color}30`, `0 0 5px ${healthStatus.color}10`] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield size={13} color={healthStatus.color} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: healthStatus.color }}>Financial Health</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.25)', padding: '3px 6px', borderRadius: 8 }}>
              <div style={{ width: 32, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: healthStatus.color, boxShadow: `0 0 4px ${healthStatus.color}` }}
                />
              </div>
              <motion.span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#fff' }}>
                {displayScore}
              </motion.span>
            </div>
            
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, color: '#fff',
              background: `linear-gradient(135deg, ${healthStatus.color}, ${healthStatus.color}dd)`, padding: '2px 6px', borderRadius: 6,
              boxShadow: `0 2px 8px ${healthStatus.color}50`
            }}>{healthStatus.label}</span>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(59, 130, 246, 0.06)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: 999, padding: '5px 12px',
              cursor: 'default', backdropFilter: 'blur(4px)',
            }}
          >
            <Clock size={13} color="#60a5fa" />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#e2e8f0' }}>This month</span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#60a5fa' }}>
              {day} {MONTH_NAMES[now.getMonth()].slice(0, 3)} – {lastDay} {MONTH_NAMES[now.getMonth()].slice(0, 3)} {year}
            </span>
          </motion.div>

          {budgetAmount > 0 && (
            <motion.div 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: 999, padding: '5px 12px',
                cursor: 'default', backdropFilter: 'blur(4px)',
              }}
            >
              <Target size={13} color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#e2e8f0' }}>Budget</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f59e0b' }}>
                {Math.round(budgetUsed)}% used
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Last updated badge */}
      <motion.div
        style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10, padding: '6px 12px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          backdropFilter: 'blur(8px)', zIndex: 10,
          x: contentTranslateX, y: contentTranslateY,
        }}
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring' }}
      >
        <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          Live Sync
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MONTHLY BUDGET SECTION
   ═══════════════════════════════════════════════════════════════════════════════ */

function BudgetSection({ totalExpenses, budgetAmount, budgetUsed, budgetStatus, monthName, year, now }) {
  const remaining = budgetAmount - totalExpenses;
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
  const dailySuggested = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  return (
    <motion.div
      className="card"
      style={{ padding: '1.25rem' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Target size={16} color="#3b82f6" />
            Monthly Budget
          </h3>
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {monthName} {year}
          </p>
        </div>
        <Link to="/budget" style={{ color: '#3b82f6', fontSize: '0.6875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <ChevronRight size={13} />
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Circular Progress */}
        <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="45" cy="45" r="37" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="7" />
            <motion.circle
              cx="45" cy="45" r="37"
              fill="none"
              stroke={budgetStatus.color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 37}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 37 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 37 * (1 - budgetUsed / 100) }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ filter: `drop-shadow(0 0 6px ${budgetStatus.color}40)` }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.span
              style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {Math.round(budgetUsed)}%
            </motion.span>
            <span style={{ fontSize: '0.5625rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>used</span>
          </div>
        </div>

        {/* Budget details */}
        <div style={{ flex: 1, minWidth: 130 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatCurrency(totalExpenses)}</span>
            <span style={{ color: 'var(--color-text-faint)' }}> spent of </span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(budgetAmount)}</span>
          </p>

          {/* Progress bar */}
          <div className="progress-bar" style={{ marginBottom: 10 }}>
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsed}%` }}
              transition={{ delay: 0.5, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: `linear-gradient(90deg, ${budgetStatus.color}, ${budgetStatus.color}cc)` }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <PiggyBank size={11} color="#10b981" />
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Remaining</span>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10b981' }}>{formatCurrency(remaining)}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <LineChart size={11} color="#06b6d4" />
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Daily Suggested</span>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#06b6d4' }}>{formatCurrency(dailySuggested)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Add Income', icon: ArrowUpRight, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)', path: '/transactions', state: { openAdd: true, type: 'income' }, cursor: 'success' },
    { label: 'Add Expense', icon: ArrowDownRight, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', path: '/transactions', state: { openAdd: true, type: 'expense' }, cursor: 'danger' },
    { label: 'Set Budget', icon: Target, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', path: '/budget', cursor: 'pointer' },
    { label: 'View Analytics', icon: BarChart3, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)', path: '/analytics', cursor: 'pointer' },
  ];

  return (
    <motion.div
      className="card"
      style={{ padding: '1.25rem' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Zap size={16} color="#f59e0b" />
            Quick Actions
          </h3>
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your finances with ease</p>
        </div>
        <ChevronRight size={15} color="var(--color-text-faint)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            data-cursor={action.cursor}
            onClick={() => navigate(action.path, action.state ? { state: action.state } : undefined)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: action.bg,
              border: `1px solid ${action.border}`,
              borderRadius: 10, padding: '0.5rem 0.625rem',
              cursor: 'pointer', color: action.color,
              fontSize: '0.75rem', fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 150ms ease',
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
          >
            <action.icon size={14} />
            <span>{action.label}</span>
            <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: 0.5 }} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FINANCIAL INSIGHTS PANEL
   ═══════════════════════════════════════════════════════════════════════════════ */

function InsightsPanel({ totalExpenses, totalIncome, budgetAmount, budgetUsed, categories, healthScore, healthStatus }) {
  const animatedScore = useSpring(0, { damping: 20, stiffness: 100 });
  const displayScore = useTransform(animatedScore, Math.round);

  useEffect(() => {
    animatedScore.set(healthScore);
  }, [healthScore, animatedScore]);

  const insights = useMemo(() => {
    const items = [];
    
    // Budget insight
    if (budgetAmount > 0) {
      if (budgetUsed < 60) {
        items.push({
          icon: Shield,
          color: '#10b981',
          title: "You're doing great!",
          text: `You've used ${Math.round(budgetUsed)}% of your monthly budget. Keep it up!`,
        });
      } else if (budgetUsed < 85) {
        items.push({
          icon: Lightbulb,
          color: '#f59e0b',
          title: 'Watch your spending',
          text: `You've used ${Math.round(budgetUsed)}% of your budget. Consider slowing down.`,
        });
      } else {
        items.push({
          icon: Zap,
          color: '#ef4444',
          title: 'Budget Alert',
          text: `You've used ${Math.round(budgetUsed)}% of your budget. Time to cut back!`,
        });
      }
    }

    // Top spending category insight
    if (categories.length > 0) {
      const top = categories[0];
      const potentialSaving = Math.round(top.total * 0.1);
      items.push({
        icon: TrendingDown,
        color: '#06b6d4',
        title: 'Spending Pattern',
        text: `${top._id} is your highest category. Reduce it by 10% to save ${formatCurrency(potentialSaving)} more.`,
      });
    }

    // Spending consistency
    const now = new Date();
    const daysPassed = now.getDate();
    if (daysPassed > 5 && totalExpenses > 0) {
      const dailyAverage = totalExpenses / daysPassed;
      items.push({
        icon: LineChart,
        color: '#8b5cf6',
        title: 'Daily Average',
        text: `You are spending an average of ${formatCurrency(Math.round(dailyAverage))} per day this month.`,
      });
    }

    return items;
  }, [budgetAmount, budgetUsed, categories, totalExpenses]);



  // For Savings Simulator
  const [simulatorValue, setSimulatorValue] = useState(0);
  
  // Forecast
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const dailyBurnRate = currentDay > 0 ? totalExpenses / currentDay : 0;
  const projectedExpenses = dailyBurnRate * daysInMonth;
  const forecastedBalance = totalIncome - projectedExpenses + simulatorValue;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Financial Insight Header Card */}
      <motion.div
        className="card"
        style={{
          padding: '1.125rem',
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={{
          fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)',
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem',
        }}>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={18} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' }} />
          </motion.div>
          Financial Insight
        </h3>

        {insights.map((insight, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, backgroundColor: `${insight.color}15`, borderColor: `${insight.color}40`, boxShadow: `0 8px 16px -4px ${insight.color}30` }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
              padding: '1rem 0.875rem',
              background: `linear-gradient(135deg, ${insight.color}08, ${insight.color}02)`,
              border: `1px solid ${insight.color}18`,
              borderRadius: 14,
              marginBottom: i < insights.length - 1 ? '0.75rem' : 0,
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 100 }}
          >
            {/* Glowing orb in the background of the card */}
            <motion.div 
              style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: `radial-gradient(circle, ${insight.color}20 0%, transparent 70%)` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
            
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: `linear-gradient(135deg, ${insight.color}25, ${insight.color}10)`,
                border: `1px solid ${insight.color}30`,
                boxShadow: `0 4px 10px ${insight.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                position: 'relative',
                zIndex: 1
              }}
            >
              <insight.icon size={16} color={insight.color} style={{ filter: `drop-shadow(0 0 4px ${insight.color}80)` }} />
            </motion.div>
            
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {insight.title}
                <ChevronRight size={14} color={`${insight.color}80`} />
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {insight.text}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Financial Health Score ─── */}
      <motion.div
        className="card"
        whileHover={{ scale: 1.01, boxShadow: `0 12px 24px -10px ${healthStatus.color}40` }}
        style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${healthStatus.color}20`,
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Animated background glow */}
        <motion.div
          style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at center, ${healthStatus.color}15 0%, transparent 50%)`, pointerEvents: 'none' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Financial Health</h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: healthStatus.color, background: `${healthStatus.color}20`, padding: '4px 10px', borderRadius: 12, boxShadow: `0 0 10px ${healthStatus.color}30` }}>
            {healthStatus.label}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', width: 86, height: 86, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: 86, height: 86 }}>
              {/* Outer faint dashed track */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeDasharray="4 4" />
              {/* Inner track */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none"
                stroke={healthStatus.color}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray="282.7"
                initial={{ strokeDashoffset: 282.7 }}
                animate={{ strokeDashoffset: 282.7 - (282.7 * healthScore) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 8px ${healthStatus.color}80)` }}
              />
            </svg>
            <div style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', textShadow: `0 0 15px ${healthStatus.color}60` }}>
              <motion.span>{displayScore}</motion.span>
            </div>
          </div>
          <p style={{ flex: 1, fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            {healthStatus.desc}
          </p>
        </div>
      </motion.div>

      {/* ─── End-of-Month Forecast ─── */}
      <motion.div className="card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.875rem' }}>
          End-of-Month Forecast
        </h3>
        {totalExpenses > 0 ? (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
              At your current daily burn rate, you're projected to have:
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: forecastedBalance >= 0 ? '#10b981' : '#ef4444' }}>
                {formatCurrency(forecastedBalance)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>net balance</span>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>Not enough data to generate a reliable forecast.</p>
        )}
      </motion.div>

      {/* ─── What-If Savings Simulator ─── */}
      <motion.div className="card" style={{ padding: '1.25rem' }} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          What if I spend less?
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Reduce upcoming spending by:
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>₹0</span>
          <input 
            type="range" 
            min="0" 
            max={Math.max(5000, Math.round(totalExpenses * 0.5))} 
            step="100" 
            value={simulatorValue}
            onChange={(e) => setSimulatorValue(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#3b82f6' }}
          />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>+{formatCurrency(simulatorValue)}</span>
        </div>
        
        {simulatorValue > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.75rem 0.875rem', borderRadius: 8, marginTop: 8 }}>
            <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, lineHeight: 1.5 }}>
              Saving {formatCurrency(simulatorValue)} covers about <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.8125rem' }}>{dailyBurnRate > 0 ? Math.round(simulatorValue / dailyBurnRate) : 0} days</strong> of your average daily spending! 
              Your new end-of-month balance would be projected at <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.8125rem' }}>{formatCurrency(forecastedBalance)}</strong>.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART TOOLTIP
   ═══════════════════════════════════════════════════════════════════════════════ */

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="chart-tooltip"
    >
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
            <span className="chart-tooltip-key">{p.dataKey}</span>
          </div>
          <span className="chart-tooltip-val">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </motion.div>
  );
}

function PieChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="chart-tooltip"
      style={{ border: `1px solid ${data.payload.color}50` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: data.payload.color, boxShadow: `0 0 10px ${data.payload.color}` }} />
        <span className="chart-tooltip-key" style={{ textTransform: 'uppercase' }}>{data.name}</span>
      </div>
      <p className="chart-tooltip-val" style={{ margin: 0, marginLeft: 16 }}>
        {formatCurrency(data.value)}
      </p>
    </motion.div>
  );
}

const renderActivePieShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0px 0px 8px ${fill}90)` }}
      />
    </g>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════════════════════ */

function DashboardPage() {
  const { user } = useAuth();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = MONTH_NAMES[now.getMonth()];

  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePieIndex, setActivePieIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, budRes, catRes, monthRes, txRes] = await Promise.allSettled([
        analyticsAPI.summary({ month, year }),
        budgetAPI.get({ month, year }),
        analyticsAPI.categories({ month, year, type: 'expense' }),
        analyticsAPI.monthly({ year }),
        transactionsAPI.getAll({ sort: 'date', order: 'desc' }),
      ]);
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data.summary);
      if (budRes.status === 'fulfilled') setBudget(budRes.value.data.budget);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.categories || []);
      if (monthRes.status === 'fulfilled') setMonthlyData(monthRes.value.data.monthly || []);
      if (txRes.status === 'fulfilled') setTransactions((txRes.value.data.transactions || []).slice(0, 5));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getGreeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;
  const budgetAmount = budget?.amount || 0;
  const budgetUsed = budgetAmount > 0 ? Math.min((totalExpenses / budgetAmount) * 100, 100) : 0;
  const budgetStatus = getBudgetStatus(budgetUsed);

  // Calculate Health Score
  const healthScore = useMemo(() => {
    let score = 50;
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
      if (savingsRate > 20) score += 20;
      else if (savingsRate > 10) score += 10;
      else if (savingsRate > 0) score += 5;
      else if (savingsRate < 0) score -= 20;
    }
    if (budgetAmount > 0) {
      if (budgetUsed < 50) score += 15;
      else if (budgetUsed < 75) score += 10;
      else if (budgetUsed < 90) score += 5;
      else if (budgetUsed > 100) score -= 15;
    }
    if (categories.length > 5) score += 10;
    else score += 5;
    return Math.min(Math.max(Math.round(score), 10), 100);
  }, [totalIncome, totalExpenses, budgetAmount, budgetUsed, categories]);

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: '#10b981', desc: 'Your financial habits are very strong.' };
    if (score >= 60) return { label: 'Good', color: '#06b6d4', desc: 'You are on the right track.' };
    if (score >= 40) return { label: 'Fair', color: '#f59e0b', desc: 'Some areas need improvement.' };
    return { label: 'Watch', color: '#ef4444', desc: 'High risk of overspending.' };
  };
  
  const healthStatus = getHealthStatus(healthScore);

  // Previous month data for trend comparison
  const prevMonthData = useMemo(() => {
    const prev = monthlyData.find(m => m.month === month - 1) || {};
    return { income: prev.income || 0, expenses: prev.expenses || 0 };
  }, [monthlyData, month]);

  const incomeTrend = prevMonthData.income > 0 ? Math.round(((totalIncome - prevMonthData.income) / prevMonthData.income) * 100) : 0;
  const expenseTrend = prevMonthData.expenses > 0 ? Math.round(((totalExpenses - prevMonthData.expenses) / prevMonthData.expenses) * 100) : 0;
  const balanceTrend = prevMonthData.income - prevMonthData.expenses !== 0
    ? Math.round(((balance - (prevMonthData.income - prevMonthData.expenses)) / Math.abs(prevMonthData.income - prevMonthData.expenses)) * 100) : 0;
  const prevBudgetUsed = 0; // Prevent carrying current month's budget to previous month calculation

  // Chart data
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const barData = monthlyData
    .filter((m) => m.income > 0 || m.expenses > 0)
    .map((m) => ({ name: monthShort[m.month - 1], Income: m.income, Expenses: m.expenses }));

  const currentMonthBarData = useMemo(() => {
    if (barData.length === 0) return barData;
    return barData;
  }, [barData]);

  const pieData = categories.map((c) => ({
    name: c._id,
    value: c.total,
    color: getCategoryColor(c._id),
  }));

  const totalExpForPie = pieData.reduce((s, c) => s + c.value, 0);

  return (
    <div className="page-padding">
      {/* ─── Main Dashboard Grid ─── */}
      <div className="dashboard-grid">
        {/* ─── Left Column — Main Content ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* ─── Hero Section ─── */}
          <HeroSection
            greeting={getGreeting()}
            firstName={firstName}
            monthName={monthName}
            year={year}
            now={now}
            budgetUsed={budgetUsed}
            budgetAmount={budgetAmount}
            healthScore={healthScore}
            healthStatus={healthStatus}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />

          {/* ─── KPI Cards ─── */}
          <div className="stats-grid">
            <StatCard
              title="Total Income"
              value={totalIncome}
              icon={TrendingUp}
              color="emerald"
              delay={0}
              loading={loading}
              trend={incomeTrend}
              trendLabel={`${incomeTrend >= 0 ? '↑' : '↓'} ${Math.abs(incomeTrend)}% from last month`}
            />
            <StatCard
              title="Total Expenses"
              value={totalExpenses}
              icon={TrendingDown}
              color="red"
              delay={0.06}
              loading={loading}
              trend={expenseTrend}
              trendLabel={`${expenseTrend >= 0 ? '↑' : '↓'} ${Math.abs(expenseTrend)}% from last month`}
            />
            <StatCard
              title="Remaining Balance"
              value={balance}
              icon={Wallet}
              color="blue"
              delay={0.12}
              loading={loading}
              trend={balanceTrend}
              trendLabel={`${balanceTrend >= 0 ? '↑' : '↓'} ${Math.abs(balanceTrend)}% from last month`}
            />
            <StatCard
              title="Budget Used"
              value={budgetAmount > 0 ? Math.round(budgetUsed) : 0}
              icon={Target}
              color="amber"
              delay={0.18}
              loading={loading}
              prefix=""
              suffix="%"
            />
          </div>

          {/* ─── Budget + Quick Actions Row ─── */}
          <div className="charts-grid">
            {budgetAmount > 0 ? (
              <BudgetSection
                totalExpenses={totalExpenses}
                budgetAmount={budgetAmount}
                budgetUsed={budgetUsed}
                budgetStatus={budgetStatus}
                monthName={monthName}
                year={year}
                now={now}
              />
            ) : (
              <motion.div
                className="card"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Target size={28} color="#3b82f6" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>No budget set</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>Set a monthly budget to track your spending</p>
                <Link to="/budget" className="btn btn-primary btn-sm">Set Budget</Link>
              </motion.div>
            )}
            <QuickActions />
          </div>

          {/* ─── Charts ─── */}
          <div className="charts-grid">
            {/* Spending Overview */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="card"
              style={{ padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    <BarChart3 size={16} color="#3b82f6" />
                    Spending Overview
                  </h3>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Income vs Expenses · This Month</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: '#10b981' }} />
                    <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Income</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: '#ef4444' }} />
                    <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Expenses</span>
                  </div>
                </div>
              </div>
              {currentMonthBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={currentMonthBarData} barGap={5}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} offset={20} />
                    <Bar dataKey="Income" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="Expenses" fill="#ef4444" radius={[5, 5, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>Add transactions to see your chart</p>
                </div>
              )}
            </motion.div>

            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
              style={{ padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    Top Categories
                  </h3>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Expense breakdown</p>
                </div>
                <ChevronRight size={15} color="var(--color-text-faint)" />
              </div>
              {pieData.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ position: 'relative', width: '48%' }}>
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          activeIndex={activePieIndex}
                          activeShape={renderActivePieShape}
                          onMouseEnter={(_, index) => setActivePieIndex(index)}
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} style={{ transition: 'all 0.3s ease' }} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieChartTooltip />} cursor={false} offset={35} wrapperStyle={{ zIndex: 100 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center label */}
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}>
                      <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        {formatCurrency(totalExpForPie)}
                      </p>
                      <p style={{ fontSize: '0.5625rem', color: 'var(--color-text-muted)' }}>Total Expenses</p>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pieData.slice(0, 5).map((c) => {
                      const pct = totalExpForPie > 0 ? ((c.value / totalExpForPie) * 100).toFixed(0) : 0;
                      return (
                        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: 2.5, background: c.color, flexShrink: 0,
                            boxShadow: `0 0 5px ${c.color}40`,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginLeft: 6 }}>{pct}%</span>
                            </div>
                            <p style={{ fontSize: '0.625rem', color: 'var(--color-text-faint)' }}>{formatCurrency(c.value)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>Add expenses to see breakdown</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ─── Recent Transactions ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div style={{
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h3 style={{
                fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <Receipt size={16} color="#3b82f6" />
                Recent Transactions
              </h3>
              <Link to="/transactions" style={{
                fontSize: '0.75rem', color: '#3b82f6', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 7,
                background: 'rgba(59, 130, 246, 0.06)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 150ms ease',
              }}>
                View all transactions <ArrowRight size={12} />
              </Link>
            </div>

            {transactions.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr 110px 100px 70px 28px',
                  gap: '0.4rem',
                  padding: '0.625rem 1.25rem',
                  borderBottom: '1px solid var(--color-border)',
                  minWidth: 560,
                }}>
                  {['Date', 'Description', 'Category', 'Amount', 'Type', ''].map((h) => (
                    <span key={h} style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </span>
                  ))}
                </div>
                {transactions.map((tx, i) => {
                  const IconComp = ICON_MAP[tx.category] || MoreHorizontal;
                  const isIncome = tx.type === 'income';
                  return (
                    <motion.div
                      key={tx._id || i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.04 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '110px 1fr 110px 100px 70px 28px',
                        gap: '0.4rem',
                        padding: '0.625rem 1.25rem',
                        borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                        alignItems: 'center',
                        transition: 'background 150ms ease',
                        cursor: 'default',
                        minWidth: 560,
                      }}
                      whileHover={{
                        backgroundColor: 'rgba(59, 130, 246, 0.03)',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {formatDateFull(tx.date)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7,
                          background: `${getCategoryColor(tx.category)}12`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <IconComp size={12} color={getCategoryColor(tx.category)} />
                        </div>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {tx.description || tx.category}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconComp size={11} color={getCategoryColor(tx.category)} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{tx.category}</span>
                      </div>
                      <span style={{
                        fontSize: '0.8125rem', fontWeight: 700,
                        color: isIncome ? '#10b981' : '#ef4444',
                      }}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                      <span style={{
                        fontSize: '0.625rem', fontWeight: 600,
                        padding: '2px 7px', borderRadius: 5,
                        background: isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: isIncome ? '#10b981' : '#ef4444',
                        textAlign: 'center',
                      }}>
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                      <MoreHorizontal size={13} color="var(--color-text-faint)" />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No transactions yet"
                description="Add your first income or expense to start tracking."
                actionLabel="+ Add Transaction"
                onAction={() => window.location.href = '/transactions'}
              />
            )}
          </motion.div>
        </div>

        {/* ─── Right Column — Insights Panel ─── */}
        <div className="right-panel" style={{ position: 'sticky', top: 'calc(var(--header-height) + 1.25rem)', alignSelf: 'start' }}>
          <InsightsPanel
            totalExpenses={totalExpenses}
            totalIncome={totalIncome}
            budgetAmount={budgetAmount}
            budgetUsed={budgetUsed}
            categories={categories}
            healthScore={healthScore}
            healthStatus={healthStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
