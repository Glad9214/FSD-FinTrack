import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.name || 'User';
  const email = user?.email || 'user@example.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-padding">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>Profile</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Manage your account details and preferences.
        </p>
      </motion.div>

      <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ─── Profile Hero Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#fff',
              boxShadow: '0 0 0 4px rgba(59,130,246,0.15), 0 8px 24px rgba(59,130,246,0.25)',
              letterSpacing: '0.02em',
            }}
          >
            {initials}
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              {displayName}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{email}</p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.85rem',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 20,
              color: '#60A5FA',
              fontSize: '0.78rem',
              fontWeight: 500,
            }}
          >
            <Shield size={12} />
            Verified Account
          </div>
        </motion.div>

        {/* ─── Account Info Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ padding: '1.5rem' }}
        >
          <h3 style={{
            fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem',
          }}>
            Account Info
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Name */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              padding: '0.875rem 1rem', background: 'var(--color-bg-elevated)',
              borderRadius: 10, border: '1px solid var(--color-border)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(59,130,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <User size={16} color="#3B82F6" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Full Name</p>
                <p style={{
                  fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 500,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {displayName}
                </p>
              </div>
            </div>

            {/* Email */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              padding: '0.875rem 1rem', background: 'var(--color-bg-elevated)',
              borderRadius: 10, border: '1px solid var(--color-border)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(139,92,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Mail size={16} color="#8B5CF6" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Email Address</p>
                <p style={{
                  fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 500,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {email}
                </p>
              </div>
            </div>

            {/* Joined */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              padding: '0.875rem 1rem', background: 'var(--color-bg-elevated)',
              borderRadius: 10, border: '1px solid var(--color-border)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(16,185,129,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Calendar size={16} color="#10B981" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Member Since</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {joinDate}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Logout Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: '1.5rem' }}
        >
          <h3 style={{
            fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem',
          }}>
            Session
          </h3>

          <button
            onClick={handleLogout}
            className="btn btn-danger btn-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              padding: '0.75rem',
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
