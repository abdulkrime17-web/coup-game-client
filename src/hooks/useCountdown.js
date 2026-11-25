import { useEffect, useRef, useState } from 'react';
import { PHASE_DEFAULT_DURATIONS } from '../lib/constants';

/**
 * Computes live countdown synchronized with server `phaseEndsAt` and `serverNow`.
 * Formula from contract:
 *   const skew = state.serverNow - Date.now();
 *   const remainingMs = state.phaseEndsAt ? Math.max(0, state.phaseEndsAt - (Date.now() + skew)) : 0;
 */
export function useCountdown(phaseEndsAt, serverNow, phase) {
  const skewRef = useRef(0);
  const totalDurationRef = useRef(12_000);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!phaseEndsAt) {
      setRemainingMs(0);
      return undefined;
    }

    const now = Date.now();
    const skew = typeof serverNow === 'number' ? serverNow - now : 0;
    skewRef.current = skew;

    const initialRemaining = Math.max(0, phaseEndsAt - (now + skew));
    const defaultDuration = PHASE_DEFAULT_DURATIONS[phase] || 12_000;
    totalDurationRef.current = Math.max(defaultDuration, initialRemaining || defaultDuration);
    setRemainingMs(initialRemaining);

    let rafId = null;
    const tick = () => {
      const next = Math.max(0, phaseEndsAt - (Date.now() + skewRef.current));
      setRemainingMs(next);
      if (next > 0) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [phaseEndsAt, serverNow, phase]);

  const totalMs = totalDurationRef.current || 12_000;
  const progress = phaseEndsAt ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const secondsLeft = Math.ceil(remainingMs / 1000);
  const isUrgent = Boolean(phaseEndsAt) && remainingMs > 0 && remainingMs <= 4000;

  return {
    active: Boolean(phaseEndsAt),
    remainingMs,
    secondsLeft,
    progress,
    isUrgent,
  };
}
