export type Scheda = 'A' | 'B' | 'C' | 'D' | 'E';

export type ExerciseVariant = 'reps' | 'hold' | 'reps_per_side';

export interface Exercise {
  name: string;
  variant: ExerciseVariant;
  defaultSets: number;
  repsMin?: number;
  repsMax?: number;
  holdSecMin?: number;
  holdSecMax?: number;
  restSecMin: number;
  restSecMax: number;
  notes?: string;
}

export interface SetRecord {
  id: string;
  exerciseName: string;
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  holdSeconds: number | null;
  note: string;
  loggedAt: string;
}

export interface SessionFeedback {
  difficulty: number;    // 1–10
  energy: number;        // 1–10
  painLeft: number;      // 0–10
  painRight: number;     // 0–10
  swellingLeft: number;  // 0–10
  notes: string;
}

export interface ActiveSession {
  id: string;
  scheda: Scheda;
  date: string;    // YYYY-MM-DD
  startTs: string; // ISO
  sets: SetRecord[];
}

export interface HistorySession {
  id: string;
  scheda: Scheda;
  date: string;
  startTs: string;
  endTs: string;
  sets: SetRecord[];
  feedback: SessionFeedback | null;
}
