import { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

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
  const endsAtRef      = useRef(0);
  const onCompleteRef  = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Track running/paused in refs so the AppState handler can read current values
  const runningRef = useRef(false);
  const pausedRef  = useRef(false);
  runningRef.current = running;
  pausedRef.current  = paused;

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

  // AppState listener: recalculate remaining from wall-clock on foreground return
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;
      if (!runningRef.current || pausedRef.current) return;

      const remaining = Math.max(0, Math.round((endsAtRef.current - Date.now()) / 1000));
      if (remaining <= 0) {
        remainingRef.current = 0;
        setRemaining(0);
        setRunning(false);
        onCompleteRef.current?.();
      } else {
        remainingRef.current = remaining;
        setRemaining(remaining);
        // Restart the interval so it ticks from this corrected value
        setTimerKey(k => k + 1);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const startTimer = useCallback((durationSec: number) => {
    durationRef.current  = durationSec;
    remainingRef.current = durationSec;
    endsAtRef.current    = Date.now() + durationSec * 1000;
    setRemaining(durationSec);
    setRunning(true);
    setPaused(false);
    setTimerKey(k => k + 1);
  }, []);

  const pause   = useCallback(() => setPaused(true), []);
  const resume  = useCallback(() => setPaused(false), []);

  const restart = useCallback(() => {
    remainingRef.current = durationRef.current;
    endsAtRef.current    = Date.now() + durationRef.current * 1000;
    setRemaining(durationRef.current);
    setRunning(true);
    setPaused(false);
    setTimerKey(k => k + 1);
  }, []);

  const stop = useCallback(() => {
    remainingRef.current = 0;
    endsAtRef.current    = 0;
    setRemaining(0);
    setRunning(false);
    setPaused(false);
  }, []);

  const adjust = useCallback((deltaSec: number) => {
    const newRemaining = Math.max(0, remainingRef.current + deltaSec);
    remainingRef.current = newRemaining;
    endsAtRef.current   += deltaSec * 1000;
    setRemaining(newRemaining);
    if (newRemaining <= 0) {
      setRunning(false);
      onCompleteRef.current?.();
    } else {
      // Restart the interval from the new remaining value
      setTimerKey(k => k + 1);
    }
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
    adjust,
  };
}
