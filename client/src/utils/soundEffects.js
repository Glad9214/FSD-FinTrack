/**
 * Web Audio API Sound Effects Manager
 * Provides instant, zero-latency transaction audio feedback synced with animations.
 */

let sharedAudioCtx = null;

/**
 * Returns the singleton AudioContext instance.
 * Automatically attempts to resume if suspended.
 */
export const getAudioContext = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
  } catch (err) {
    console.warn('AudioContext unavailable:', err);
    return null;
  }
};

/**
 * Pre-warm/unlock audio context on user gesture.
 * Crucial to call within synchronous click handlers before async operations.
 */
export const unlockAudio = () => {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch (_) {
    return null;
  }
};

// Global interaction listeners to warm up audio on first user touch/click/press
if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    unlockAudio();
  };

  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((eventName) => {
    window.addEventListener(eventName, handleFirstInteraction, {
      capture: true,
      passive: true,
    });
  });
}

/**
 * Plays a rich, synchronized sound effect for transactions.
 * Starts immediately with zero latency alongside the 3D coin animations.
 * @param {'income' | 'expense'} type 
 */
export const playTransactionSound = async (type) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === 'income') {
      // ─── Income: Bright, ascending coin chimes & metallic tingles ───
      // 1. Ascending melodic coin chime chord (B5, E6, G#6, B6, E7)
      const freqs = [987.77, 1318.51, 1661.22, 1975.53, 2637.02];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const startTime = now + (i * 0.055); // Rapid musical cascade
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });

      // 2. High metallic coin clinks matching the coin explosion
      const coinTingles = [2800, 3400, 3100, 3900, 2600];
      coinTingles.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 100 - 50), now);

        const startTime = now + 0.04 + (idx * 0.065);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.start(startTime);
        osc.stop(startTime + 0.14);
      });

    } else {
      // ─── Expense: Crisp deduction drop & metallic coin clatter ───
      // 1. Punchy downward debit chime
      const debitOsc = ctx.createOscillator();
      const debitGain = ctx.createGain();
      debitOsc.connect(debitGain);
      debitGain.connect(ctx.destination);

      debitOsc.type = 'sine';
      debitOsc.frequency.setValueAtTime(1250, now);
      debitOsc.frequency.exponentialRampToValueAtTime(580, now + 0.18);

      debitGain.gain.setValueAtTime(0, now);
      debitGain.gain.linearRampToValueAtTime(0.5, now + 0.005);
      debitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      debitOsc.start(now);
      debitOsc.stop(now + 0.24);

      // 2. Cascading metallic coin dropping / clattering effects
      const dropFreqs = [1400, 1150, 920, 750, 580];
      dropFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Mix of sine and square for authentic metallic coin clatter
        osc.type = i % 2 === 0 ? 'sine' : 'square';
        const startFreq = freq + (Math.random() * 80 - 40);
        osc.frequency.setValueAtTime(startFreq, now);

        const startTime = now + (i * 0.045);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, startTime + 0.14);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(i % 2 === 0 ? 0.35 : 0.15, startTime + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

        osc.start(startTime);
        osc.stop(startTime + 0.16);
      });
    }
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
};
