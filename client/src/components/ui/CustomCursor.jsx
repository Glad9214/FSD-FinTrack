import { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor
 * High-performance, 60fps/120fps fluid magnetic cursor follower
 * with contextual hover morphing, spotlight card tracking, and click feedback.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const auraRef = useRef(null);
  const ripplesRef = useRef([]);

  const [hoverState, setHoverState] = useState('default'); // 'default' | 'pointer' | 'card' | 'text' | 'danger' | 'success'
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Mouse physics coordinates
  const pos = useRef({
    targetX: -100,
    targetY: -100,
    currentX: -100,
    currentY: -100,
    ringX: -100,
    ringY: -100,
    auraX: -100,
    auraY: -100,
  });

  const animFrameId = useRef(null);

  useEffect(() => {
    // Disable on coarse pointer devices (touchscreens, mobile, tablets)
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMouseMove = (e) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Card Spotlight: dynamically feed mouse coordinates to hovered cards/surfaces
      const target = e.target;
      if (target) {
        const card = target.closest(
          '.card, .card-hoverable, .stat-card, .dashboard-card, .modal-content, .auth-box, .auth-brand-panel'
        );
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }

        // Contextual cursor state detection
        if (target.closest('.btn-danger, [data-cursor="danger"], .trash-btn')) {
          setHoverState('danger');
        } else if (target.closest('.btn-success, [data-cursor="success"], .income-toggle')) {
          setHoverState('success');
        } else if (
          target.closest(
            'button, a, [role="button"], .btn, .nav-item, .notification-btn, .top-header-avatar, .tab-btn, [data-cursor="pointer"]'
          )
        ) {
          setHoverState('pointer');
        } else if (
          target.closest('input, textarea, select, [contenteditable="true"], .input-field, .select-field')
        ) {
          setHoverState('text');
        } else if (target.closest('.card, .stat-card, .dashboard-card, .tx-table-row, [data-cursor="card"]')) {
          setHoverState('card');
        } else {
          setHoverState('default');
        }
      }
    };

    const onMouseDown = (e) => {
      setIsClicking(true);
      // Spawn micro-ripple at click point
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.documentElement.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // Smooth lerp render loop
    const renderLoop = () => {
      const p = pos.current;

      // Precision dot: immediate interpolation for responsive feeling
      p.currentX += (p.targetX - p.currentX) * 0.75;
      p.currentY += (p.targetY - p.currentY) * 0.75;

      // Trailing follower ring: smooth elastic lerp
      p.ringX += (p.targetX - p.ringX) * 0.22;
      p.ringY += (p.targetY - p.ringY) * 0.22;

      // Ambient aura halo: soft lagging float
      p.auraX += (p.targetX - p.auraX) * 0.08;
      p.auraY += (p.targetY - p.auraY) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${p.currentX}px, ${p.currentY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${p.ringX}px, ${p.ringY}px, 0)`;
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${p.auraX}px, ${p.auraY}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples]);

  // If touch device or hidden, don't show
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  // Ring dimension & styles by hover state
  const getRingStyles = () => {
    const clicking = isClicking ? 0.8 : 1;
    switch (hoverState) {
      case 'pointer':
        return {
          width: 48,
          height: 48,
          borderColor: 'rgba(59, 130, 246, 0.85)',
          background: 'rgba(59, 130, 246, 0.12)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 10px rgba(59, 130, 246, 0.15)',
          scale: 1.15 * clicking,
          backdropFilter: 'blur(2px)',
        };
      case 'danger':
        return {
          width: 52,
          height: 52,
          borderColor: 'rgba(239, 68, 68, 0.85)',
          background: 'rgba(239, 68, 68, 0.15)',
          boxShadow: '0 0 24px rgba(239, 68, 68, 0.5), inset 0 0 12px rgba(239, 68, 68, 0.2)',
          scale: 1.2 * clicking,
          backdropFilter: 'blur(2px)',
        };
      case 'success':
        return {
          width: 52,
          height: 52,
          borderColor: 'rgba(16, 185, 129, 0.85)',
          background: 'rgba(16, 185, 129, 0.15)',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.5), inset 0 0 12px rgba(16, 185, 129, 0.2)',
          scale: 1.2 * clicking,
          backdropFilter: 'blur(2px)',
        };
      case 'card':
        return {
          width: 60,
          height: 60,
          borderColor: 'rgba(59, 130, 246, 0.35)',
          background: 'rgba(59, 130, 246, 0.05)',
          boxShadow: '0 0 16px rgba(59, 130, 246, 0.2)',
          scale: 1.05 * clicking,
          backdropFilter: 'none',
        };
      case 'text':
        return {
          width: 24,
          height: 32,
          borderRadius: '4px',
          borderColor: 'rgba(59, 130, 246, 0.7)',
          background: 'rgba(59, 130, 246, 0.08)',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.25)',
          scale: 0.9 * clicking,
          backdropFilter: 'none',
        };
      default:
        return {
          width: 32,
          height: 32,
          borderColor: 'rgba(59, 130, 246, 0.45)',
          background: 'rgba(59, 130, 246, 0.03)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.15)',
          scale: 1 * clicking,
          backdropFilter: 'none',
        };
    }
  };

  const ringStyle = getRingStyles();

  return (
    <div
      className="custom-cursor-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* ─── Ambient Glow Halo (Large soft trailing light) ─── */}
      <div
        ref={auraRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 140,
          height: 140,
          marginLeft: -70,
          marginTop: -70,
          borderRadius: '50%',
          background:
            hoverState === 'danger'
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)'
              : hoverState === 'success'
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 70%)',
          willChange: 'transform',
          transition: 'background 0.3s ease',
        }}
      />

      {/* ─── Floating Follower Ring ─── */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: ringStyle.width,
          height: ringStyle.height,
          marginLeft: -(ringStyle.width / 2),
          marginTop: -(ringStyle.height / 2),
          borderRadius: ringStyle.borderRadius || '50%',
          border: `1.5px solid ${ringStyle.borderColor}`,
          background: ringStyle.background,
          boxShadow: ringStyle.boxShadow,
          backdropFilter: ringStyle.backdropFilter,
          WebkitBackdropFilter: ringStyle.backdropFilter,
          transform: `scale(${ringStyle.scale})`,
          transition:
            'width 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, border-radius 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* ─── Precision Center Dot ─── */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: hoverState === 'text' ? 2 : hoverState === 'pointer' ? 6 : 7,
          height: hoverState === 'text' ? 16 : hoverState === 'pointer' ? 6 : 7,
          marginLeft: hoverState === 'text' ? -1 : hoverState === 'pointer' ? -3 : -3.5,
          marginTop: hoverState === 'text' ? -8 : hoverState === 'pointer' ? -3 : -3.5,
          borderRadius: hoverState === 'text' ? 1 : '50%',
          background:
            hoverState === 'danger'
              ? '#ef4444'
              : hoverState === 'success'
              ? '#10b981'
              : '#60a5fa',
          boxShadow:
            hoverState === 'danger'
              ? '0 0 10px #ef4444'
              : hoverState === 'success'
              ? '0 0 10px #10b981'
              : '0 0 12px #3b82f6, 0 0 4px #fff',
          willChange: 'transform',
          transition:
            'width 0.15s ease, height 0.15s ease, border-radius 0.15s ease, background 0.2s ease, box-shadow 0.2s ease',
        }}
      />

      {/* ─── Click Micro-Ripples ─── */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          style={{
            position: 'absolute',
            top: rip.y,
            left: rip.x,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: '50%',
            border: '2px solid rgba(59, 130, 246, 0.6)',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
            animation: 'cursor-ripple 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Ripple Animation Style */}
      <style>{`
        @keyframes cursor-ripple {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
