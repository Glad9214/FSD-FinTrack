import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const COLORS = {
  success: { bg: '#0d2a1f', border: 'rgba(16,185,129,0.3)', icon: '#10B981', text: '#34D399' },
  error: { bg: '#2a0d0d', border: 'rgba(239,68,68,0.3)', icon: '#EF4444', text: '#F87171' },
  warning: { bg: '#2a1f0d', border: 'rgba(245,158,11,0.3)', icon: '#F59E0B', text: '#FCD34D' },
  info: { bg: '#0d1a2a', border: 'rgba(59,130,246,0.3)', icon: '#3B82F6', text: '#93C5FD' },
};

function Toast({ id, type = 'info', title, message, onDismiss }) {
  const c = COLORS[type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        minWidth: 300,
        maxWidth: 380,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      <span style={{ color: c.icon, marginTop: 1, flexShrink: 0 }}>{ICONS[type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ color: c.text, fontWeight: 600, fontSize: '0.875rem', marginBottom: message ? 2 : 0 }}>
            {title}
          </p>
        )}
        {message && (
          <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.4 }}>{message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  // Convenience shortcuts
  toast.success = (title, message) => toast({ type: 'success', title, message });
  toast.error = (title, message) => toast({ type: 'error', title, message });
  toast.warning = (title, message) => toast({ type: 'warning', title, message });
  toast.info = (title, message) => toast({ type: 'info', title, message });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export default ToastContext;
