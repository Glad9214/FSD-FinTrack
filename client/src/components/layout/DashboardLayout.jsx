import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const dateStr = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()].slice(0, 3)} ${now.getFullYear()}`;

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
            <Search size={16} />
            <input type="text" placeholder="Search anything…" readOnly />
          </div>

          <div className="top-header-right">
            <span className="top-header-date">{dateStr}</span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ position: 'relative', padding: '0.5rem' }}
            >
              <Bell size={18} />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/profile')}
            >
              <span className="top-header-username">{user?.name?.split(' ')[0] || 'User'}</span>
              <div className="top-header-avatar">
                {getInitials(user?.name)}
              </div>
            </div>
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
            <Menu size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>FT</span>
            </div>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>FinTrack</span>
          </div>

          <div
            className="top-header-avatar"
            style={{ width: 32, height: 32, fontSize: '0.75rem' }}
            onClick={() => navigate('/profile')}
          >
            {getInitials(user?.name)}
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
