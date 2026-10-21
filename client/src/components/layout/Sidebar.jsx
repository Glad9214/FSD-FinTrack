import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart3,
  CalendarDays,
  User,
  LogOut,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const navSections = [
  {
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
      { to: '/budget', icon: Target, label: 'Budget' },
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/monthly-summary', icon: CalendarDays, label: 'Monthly Summary' },
    ],
  },
];

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="sidebar-overlay visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${open ? 'open' : ''}`} style={{ 
        overflow: 'hidden', 
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.03)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
      }}>
        
        {/* 3D Animated Background with Peak */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          
          {/* Glowing Peak SVG at the bottom */}
          <motion.svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '60%', width: '100%',
              opacity: 0.6,
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <defs>
              <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M0,100 L0,70 Q20,65 35,40 T65,30 T100,50 L100,100 Z" 
              fill="url(#peakGrad)"
            />
            <motion.path 
              d="M0,70 Q20,65 35,40 T65,30 T100,50" 
              fill="none" 
              stroke="#60a5fa" 
              strokeWidth="0.5"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.svg>

          {/* Deep Space Orbs */}
          <motion.div
            style={{
              position: 'absolute', top: '-10%', left: '-20%',
              width: 250, height: 250, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent 70%)',
              filter: 'blur(30px)'
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Logo Section */}
        <div
          style={{
            position: 'relative', zIndex: 1,
            padding: '1.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <NavLink
            to="/dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}
          >
            <motion.div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 8px 20px -4px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
              whileHover={{ 
                rotateY: 15, 
                rotateX: -10, 
                scale: 1.05,
                boxShadow: '0 12px 25px -4px rgba(59, 130, 246, 0.6), inset 0 2px 4px rgba(255,255,255,0.5)' 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <TrendingUp size={20} color="white" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </motion.div>
            <div>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-0.03em',
                textShadow: '0 2px 10px rgba(255,255,255,0.2)'
              }}>
                FinTrack
              </p>
              <p style={{
                fontSize: '0.625rem',
                color: '#94a3b8',
                letterSpacing: '0.15em',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                Track • Plan • Grow
              </p>
            </div>
          </NavLink>

          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ display: 'none' }}
            id="sidebar-close"
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '0.5rem 1rem', flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {navSections[0].items.map((item, ii) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderRadius: 12,
                      color: isActive ? '#fff' : '#94a3b8',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.05))' 
                        : 'transparent',
                      boxShadow: isActive 
                        ? 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.2)' 
                        : 'none',
                      border: isActive 
                        ? '1px solid rgba(59, 130, 246, 0.3)' 
                        : '1px solid transparent',
                      transformStyle: 'preserve-3d',
                    }}
                    whileHover={{ 
                      scale: isActive ? 1.02 : 1.0, 
                      x: isActive ? 0 : 4,
                      background: !isActive ? 'rgba(255,255,255,0.03)' : undefined
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Glowing active indicator dot */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          left: '-4px',
                          top: '50%',
                          marginTop: '-12px',
                          width: '4px',
                          height: '24px',
                          background: '#3b82f6',
                          borderRadius: '0 4px 4px 0',
                          boxShadow: '0 0 10px #3b82f6, 0 0 20px #60a5fa',
                        }}
                      />
                    )}
                    
                    <motion.div 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%', 
                        filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none'
                      }}
                    >
                      <item.icon size={18} style={{ color: isActive ? '#60a5fa' : 'inherit' }} />
                      <span>{item.label}</span>
                    </motion.div>
                  </motion.div>
                </NavLink>
              );
            })}
          </div>

          {/* Profile link separated */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <NavLink
              to="/profile"
              onClick={onClose}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <motion.div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    color: isActive ? '#fff' : '#94a3b8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.05))' 
                      : 'transparent',
                    boxShadow: isActive 
                      ? 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.2)' 
                      : 'none',
                    border: isActive 
                      ? '1px solid rgba(59, 130, 246, 0.3)' 
                      : '1px solid transparent',
                  }}
                  whileHover={{ scale: isActive ? 1.02 : 1.0, x: isActive ? 0 : 4, background: !isActive ? 'rgba(255,255,255,0.03)' : undefined }}
                >
                  <motion.div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%' }}>
                    <User size={18} style={{ color: isActive ? '#60a5fa' : 'inherit' }} />
                    <span>Profile</span>
                  </motion.div>
                </motion.div>
              )}
            </NavLink>
          </div>
        </nav>

        {/* User section Footer */}
        <div style={{ position: 'relative', zIndex: 1, padding: '1rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.8))',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 8px 20px rgba(0,0,0,0.4)',
              marginBottom: 12,
              transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: 1.02, rotateX: 5, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 12px 25px rgba(0,0,0,0.5)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div
              style={{
                width: 40, height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: 800, color: 'white',
                boxShadow: '0 4px 12px rgba(96, 165, 250, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                {user?.email}
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 12, padding: '0.625rem', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fee2e2' }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
