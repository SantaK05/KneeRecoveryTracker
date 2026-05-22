import { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

function formatHHMMSS(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export function useTimer() {
  const segmentStartMsRef = useRef<number | null>(null);
  const accumulatedMsRef  = useRef<number>(0);

  const getElapsedMs = (): number => {
    const seg = segmentStartMsRef.current;
    return accumulatedMsRef.current + (seg !== null ? Date.now() - seg : 0);
  };

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const refresh = useCallback(() => {
    setElapsedSec(Math.floor(getElapsedMs() / 1000));
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [isRunning, refresh]);

  useEffect(() => {
    const handler = (next: AppStateStatus) => {
      if (next === 'active') refresh();
    };
    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, [refresh]);

  const start = useCallback(() => {
    if (segmentStartMsRef.current !== null) return;
    segmentStartMsRef.current = Date.now();
    setIsRunning(true);
    refresh();
  }, [refresh]);

  const stop = useCallback(() => {
    if (segmentStartMsRef.current === null) return;
    accumulatedMsRef.current += Date.now() - segmentStartMsRef.current;
    segmentStartMsRef.current = null;
    setIsRunning(false);
    refresh();
  }, [refresh]);

  const reset = useCallback(() => {
    segmentStartMsRef.current = null;
    accumulatedMsRef.current  = 0;
    setIsRunning(false);
    setElapsedSec(0);
  }, []);

  return {
    isRunning,
    elapsedSec,
    formattedTime: formatHHMMSS(elapsedSec),
    start,
    stop,
    reset,
  };
}
