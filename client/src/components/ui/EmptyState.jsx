import { motion } from 'framer-motion';
import Button from './Button';

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      {Icon && (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Icon size={32} color="#3B82F6" strokeWidth={1.5} />
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#F9FAFB', marginBottom: 6 }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: 340, lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>

      {(actionLabel || secondaryLabel) && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
          {actionLabel && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button variant="secondary" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default EmptyState;
