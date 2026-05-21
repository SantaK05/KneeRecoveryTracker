import { useState, useRef, useEffect, useCallback } from 'react';

function formatHHMMSS(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start  = useCallback(() => setRunning(true), []);
  const stop   = useCallback(() => setRunning(false), []);
  const reset  = useCallback(() => {
    setRunning(false);
    elapsedRef.current = 0;
    setElapsed(0);
  }, []);

  return {
    isRunning:     running,
    elapsedSec:    elapsed,
    formattedTime: formatHHMMSS(elapsed),
    start,
    stop,
    reset,
  };
}
