import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    type = 'text',
    placeholder,
    prefix,
    suffix,
    className = '',
    required,
    disabled,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span style={{ color: 'var(--color-red)', marginLeft: 3 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: '0.875rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.9375rem',
              pointerEvents: 'none',
              fontWeight: 500,
            }}
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input-field ${className}`}
          style={{
            paddingLeft: prefix ? '2.25rem' : undefined,
            paddingRight: (isPassword || suffix) ? '2.75rem' : undefined,
            borderColor: error ? 'rgba(239,68,68,0.5)' : undefined,
          }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: '0.875rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
              padding: 0,
            }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {suffix && !isPassword && (
          <span
            style={{
              position: 'absolute',
              right: '0.875rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-red-light)' }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{hint}</p>
      )}
    </div>
  );
});

export default Input;
