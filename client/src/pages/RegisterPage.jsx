import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, AlertCircle, Eye, EyeOff,
  User, Mail, Lock, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#10b981' },
  ];
  return { score, ...map[Math.min(score, 4)] };
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      toast.success('Account created!', 'Welcome to FinTrack');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (field) => ({
    paddingLeft: '2.5rem',
    paddingRight: field === 'password' || field === 'confirmPassword' ? '2.75rem' : undefined,
    borderColor: errors[field] ? 'rgba(239,68,68,0.5)' : undefined,
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex' }}>
      {/* ─── Left — Branding ─── */}
      <div
        className="auth-brand-panel"
        style={{
          flex: '1 1 50%', padding: 'clamp(2rem, 4vw, 3.5rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-elevated) 100%)',
          borderRight: '1px solid var(--color-border)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', bottom: '20%', right: '20%', width: 350, height: 350,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>FinTrack</span>
          </Link>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800,
            color: 'var(--color-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15,
            marginBottom: '1rem',
          }}>
            Build Better{' '}
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Financial Habits.
            </span>
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 380 }}>
            Join thousands of users who are already taking control of their finances.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {['Track your expenses', 'Set monthly budgets', 'Achieve your goals'].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <CheckCircle size={16} color="#10b981" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right — Form ─── */}
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              Create Your Account
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Start tracking in less than a minute.
            </p>
          </div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8, padding: '0.75rem', marginBottom: '1.25rem',
                fontSize: '0.8125rem', color: 'var(--color-red-light)',
              }}
            >
              <AlertCircle size={15} />
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* Full Name */}
            <div>
              <label className="field-label">Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input className="input-field" type="text" placeholder="John Doe" value={form.name} onChange={handleChange('name')} autoComplete="name" style={fieldStyle('name')} />
              </div>
              {errors.name && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="field-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange('email')} autoComplete="email" style={fieldStyle('email')} />
              </div>
              {errors.email && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input className="input-field" type={showPwd ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={handleChange('password')} autoComplete="new-password" style={fieldStyle('password')} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{errors.password}</p>}
              {form.password && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} style={{ flex: 1, height: 3, borderRadius: 99, background: n <= strength.score ? strength.color : 'var(--color-border)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: strength.color, fontWeight: 500 }}>Password strength: {strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="field-label">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input className="input-field" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} autoComplete="new-password" style={fieldStyle('confirmPassword')} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{errors.confirmPassword}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg btn-full"
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '0.375rem', background: '#10b981' }}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ padding: '0 1rem' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <motion.button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await loginWithGoogle();
                  toast.success('Account created!', 'Welcome to FinTrack');
                  navigate('/dashboard');
                } catch (err) {
                  setApiError(err.message || 'Google Sign-In failed.');
                } finally {
                  setLoading(false);
                }
              }}
              className="btn btn-secondary btn-lg btn-full"
              whileTap={{ scale: 0.98 }}
              style={{ 
                background: 'var(--color-bg-elevated)', 
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
