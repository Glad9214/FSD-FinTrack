import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, Calendar, ChevronDown, Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000)) / 86400000;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const now = new Date();
  const dateStr = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()].slice(0, 3)} ${now.getFullYear()}`;
  const weekStr = `Week ${getWeekNumber(now)}`;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="layout-root">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Desktop top header */}
        <header className="top-header">
          <div className="top-header-search">
            <Search size={15} />
            <input type="text" placeholder="Search transactions, categories..." readOnly />
            <span className="search-shortcut">Ctrl + K</span>
          </div>

          <div className="top-header-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={13} style={{ color: 'var(--color-text-faint)' }} />
              <div>
                <span className="top-header-date">{dateStr}</span>
                <br />
                <span className="top-header-week">{weekStr}</span>
              </div>
            </div>

            <motion.button
              className="notification-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>

            <motion.button
              className="notification-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={17} />
              <span className="notification-dot" />
            </motion.button>

            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                padding: '3px 7px 3px 10px',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 150ms ease',
                border: '1px solid transparent',
              }}
              onClick={() => navigate('/profile')}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderColor: 'var(--color-border)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="top-header-username">{user?.name?.split(' ')[0] || 'User'}</span>
              <div className="top-header-avatar">
                {getInitials(user?.name)}
              </div>
              <ChevronDown size={12} style={{ color: 'var(--color-text-faint)' }} />
            </motion.div>
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="mobile-header">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: 4,
              display: 'flex',
            }}
          >
            <Menu size={21} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              }}
            >
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'white' }}>FT</span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>FinTrack</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div
              className="top-header-avatar"
              style={{ width: 30, height: 30, fontSize: '0.6875rem' }}
              onClick={() => navigate('/profile')}
            >
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
