import { useState, useRef, useEffect, useCallback } from 'react';

function formatMMSS(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function useRestTimer(onComplete?: () => void) {
  const [remaining, setRemaining]   = useState(0);
  const [running, setRunning]       = useState(false);
  const [paused, setPaused]         = useState(false);
  // timerKey increments to force the effect to restart the interval
  const [timerKey, setTimerKey]     = useState(0);

  const durationRef    = useRef(0);
  const remainingRef   = useRef(0);
  const onCompleteRef  = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => {
      const next = remainingRef.current - 1;
      remainingRef.current = Math.max(0, next);
      setRemaining(remainingRef.current);
      if (next <= 0) {
        clearInterval(id);
        setRunning(false);
        onCompleteRef.current?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running, paused, timerKey]);

  const startTimer = useCallback((durationSec: number) => {
    durationRef.current  = durationSec;
    remainingRef.current = durationSec;
    setRemaining(durationSec);
    setRunning(true);
    setPaused(false);
    setTimerKey(k => k + 1);
  }, []);

  const pause   = useCallback(() => setPaused(true), []);
  const resume  = useCallback(() => setPaused(false), []);

  const restart = useCallback(() => {
    remainingRef.current = durationRef.current;
    setRemaining(durationRef.current);
    setRunning(true);
    setPaused(false);
    setTimerKey(k => k + 1);
  }, []);

  const stop = useCallback(() => {
    remainingRef.current = 0;
    setRemaining(0);
    setRunning(false);
    setPaused(false);
  }, []);

  return {
    isRunning:     running,
    isPaused:      paused,
    remainingSec:  remaining,
    formattedTime: formatMMSS(remaining),
    startTimer,
    pause,
    resume,
    restart,
    stop,
  };
}
