import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import {
  Scheda,
  SetRecord,
  SessionFeedback,
  ActiveSession,
  HistorySession,
} from '../types';

// ── State ────────────────────────────────────────────────────────────────────

interface WorkoutState {
  selectedScheda: Scheda | null;
  currentSession: ActiveSession | null;
  sessions: HistorySession[];
  historyLoaded: boolean;
}

const initialState: WorkoutState = {
  selectedScheda: null,
  currentSession: null,
  sessions:       [],
  historyLoaded:  false,
};

// ── Actions ───────────────────────────────────────────────────────────────────

type WorkoutAction =
  | { type: 'SELECT_SCHEDA'; scheda: Scheda }
  | { type: 'START_SESSION'; session: ActiveSession }
  | { type: 'LOG_SET'; set: SetRecord }
  | { type: 'END_SESSION'; endTs: string; feedback: SessionFeedback }
  | { type: 'SET_HISTORY'; sessions: HistorySession[] };

function reducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'SELECT_SCHEDA':
      return { ...state, selectedScheda: action.scheda };

    case 'START_SESSION':
      return { ...state, currentSession: action.session };

    case 'LOG_SET':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          sets: [...state.currentSession.sets, action.set],
        },
      };

    case 'END_SESSION': {
      if (!state.currentSession) return state;
      const completed: HistorySession = {
        ...state.currentSession,
        endTs:    action.endTs,
        feedback: action.feedback,
      };
      return {
        ...state,
        currentSession: null,
        sessions:       [completed, ...state.sessions],
      };
    }

    case 'SET_HISTORY':
      return { ...state, sessions: action.sessions, historyLoaded: true };

    default:
      return state;
  }
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function fireAndForget(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    console.warn('[Supabase] write failed, retrying in 5s:', err);
    setTimeout(async () => {
      try {
        await fn();
      } catch (retryErr) {
        console.error('[Supabase] retry failed:', retryErr);
      }
    }, 5000);
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface WorkoutContextValue {
  state: WorkoutState;
  selectScheda:    (scheda: Scheda) => void;
  startSession:    (scheda: Scheda) => void;
  logSet:          (data: Omit<SetRecord, 'id' | 'loggedAt'>) => void;
  endSession:      (feedback: SessionFeedback) => void;
  loadHistory:     () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const selectScheda = useCallback((scheda: Scheda) => {
    dispatch({ type: 'SELECT_SCHEDA', scheda });
  }, []);

  const startSession = useCallback((scheda: Scheda) => {
    const id  = crypto.randomUUID();
    const now = new Date().toISOString();
    const session: ActiveSession = {
      id,
      scheda,
      date:    now.split('T')[0],
      startTs: now,
      sets:    [],
    };

    dispatch({ type: 'START_SESSION', session });

    fireAndForget(async () => {
      const { error } = await supabase.from('workout_sessions').insert({
        id,
        scheda,
        date:     session.date,
        start_ts: session.startTs,
      });
      if (error) throw error;
    });
  }, []);

  const logSet = useCallback((data: Omit<SetRecord, 'id' | 'loggedAt'>) => {
    const sessionId = stateRef.current.currentSession?.id;
    if (!sessionId) return;

    const id       = crypto.randomUUID();
    const loggedAt = new Date().toISOString();
    const set: SetRecord = { ...data, id, loggedAt };

    dispatch({ type: 'LOG_SET', set });

    fireAndForget(async () => {
      const { error } = await supabase.from('session_sets').insert({
        id,
        session_id:    sessionId,
        exercise_name: set.exerciseName,
        set_number:    set.setNumber,
        weight_kg:     set.weightKg,
        reps:          set.reps,
        hold_seconds:  set.holdSeconds,
        note:          set.note || null,
        logged_at:     loggedAt,
      });
      if (error) throw error;
    });
  }, []);

  const endSession = useCallback((feedback: SessionFeedback) => {
    const session = stateRef.current.currentSession;
    if (!session) return;

    const endTs     = new Date().toISOString();
    const sessionId = session.id;

    dispatch({ type: 'END_SESSION', endTs, feedback });

    fireAndForget(async () => {
      const { error: e1 } = await supabase
        .from('workout_sessions')
        .update({ end_ts: endTs })
        .eq('id', sessionId);
      if (e1) throw e1;

      const { error: e2 } = await supabase.from('session_feedback').insert({
        id:            crypto.randomUUID(),
        session_id:    sessionId,
        difficulty:    feedback.difficulty,
        energy:        feedback.energy,
        pain_left:     feedback.painLeft,
        pain_right:    feedback.painRight,
        swelling_left: feedback.swellingLeft,
        notes:         feedback.notes || null,
      });
      if (e2) throw e2;
    });
  }, []);

  const loadHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        id, scheda, date, start_ts, end_ts,
        session_sets ( id, exercise_name, set_number, weight_kg, reps, hold_seconds, note, logged_at ),
        session_feedback ( difficulty, energy, pain_left, pain_right, swelling_left, notes )
      `)
      .not('end_ts', 'is', null)
      .order('date', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[Supabase] loadHistory failed:', error);
      return;
    }

    const sessions: HistorySession[] = (data ?? []).map((s: any) => ({
      id:      s.id,
      scheda:  s.scheda as Scheda,
      date:    s.date,
      startTs: s.start_ts,
      endTs:   s.end_ts,
      sets: (s.session_sets ?? []).map((r: any): SetRecord => ({
        id:           r.id,
        exerciseName: r.exercise_name,
        setNumber:    r.set_number,
        weightKg:     r.weight_kg,
        reps:         r.reps,
        holdSeconds:  r.hold_seconds,
        note:         r.note ?? '',
        loggedAt:     r.logged_at,
      })),
      feedback: s.session_feedback?.[0]
        ? {
            difficulty:   s.session_feedback[0].difficulty,
            energy:       s.session_feedback[0].energy,
            painLeft:     s.session_feedback[0].pain_left,
            painRight:    s.session_feedback[0].pain_right,
            swellingLeft: s.session_feedback[0].swelling_left,
            notes:        s.session_feedback[0].notes ?? '',
          }
        : null,
    }));

    dispatch({ type: 'SET_HISTORY', sessions });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{ state, selectScheda, startSession, logSet, endSession, loadHistory }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useWorkout(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used inside WorkoutProvider');
  return ctx;
}
