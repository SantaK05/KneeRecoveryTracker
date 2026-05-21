import { Exercise, Scheda } from '../types';

export const schedaB: Exercise[] = [
  {
    name: 'Stacco Rumeno (Bilancere)',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 6,
    repsMax: 8,
    restSecMin: 120,
    restSecMax: 150,
    notes: 'Barbell RDL. Schiena neutra, cerniera all\'anca. Bilancere vicino alle gambe per tutto il ROM.',
  },
  {
    name: 'Leg Curl Sdraiato',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 8,
    repsMax: 12,
    restSecMin: 90,
    restSecMax: 90,
    notes: 'Fase eccentrica lenta (3 sec). Evitare di sollevare i fianchi.',
  },
  {
    name: 'Hip Thrust / Glute Bridge',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 8,
    repsMax: 10,
    restSecMin: 120,
    restSecMax: 120,
    notes: 'Squeeze glutei in cima. Evitare iperestensione lombare.',
  },
  {
    name: 'Back Extension 45° / Cable Pull-Through',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 10,
    repsMax: 12,
    restSecMin: 90,
    restSecMax: 90,
    notes: 'Bias gluteo. Cerniera all\'anca, non estensione lombare.',
  },
  {
    name: 'Abduzione Anca',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 12,
    repsMax: 20,
    restSecMin: 60,
    restSecMax: 75,
    notes: 'Machine, cavo o side-lying. Movimento controllato.',
  },
  {
    name: 'Isometria Femoro-Rotulea',
    variant: 'hold',
    defaultSets: 5,
    holdSecMin: 30,
    holdSecMax: 45,
    restSecMin: 60,
    restSecMax: 60,
    notes: 'Wall sit alto o Spanish squat. No dolore acuto al ginocchio.',
  },
  {
    name: 'Polpacci alla Pressa',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 15,
    repsMax: 20,
    restSecMin: 75,
    restSecMax: 90,
    notes: 'Range completo. Pausa in cima e in basso.',
  },
  {
    name: 'Core: Crunch Cavo Alto / Crunch Machine',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 12,
    repsMax: 20,
    restSecMin: 60,
    restSecMax: 90,
    notes: '3–4 serie. Focus su contrazione addominale piena.',
  },
];

export const schedaD: Exercise[] = [
  {
    name: 'Stacco Rumeno (Manubri)',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 6,
    repsMax: 8,
    restSecMin: 120,
    restSecMax: 120,
    notes: 'Dumbbell RDL. Schiena neutra. Unilaterale se utile per bilanciamento.',
  },
  {
    name: 'Leg Curl Sdraiato',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 10,
    repsMax: 12,
    restSecMin: 90,
    restSecMax: 90,
    notes: 'Eccentrica lenta (3 sec). Punta i piedi leggermente in fuori.',
  },
  {
    name: 'Reverse Hyper / Back Extension 45° Glute-Ham',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 10,
    repsMax: 12,
    restSecMin: 90,
    restSecMax: 90,
    notes: 'Enfasi su tutta la catena posteriore. Squeeze glutei in cima.',
  },
  {
    name: 'Adduttori Isometrici (palla/cuscino)',
    variant: 'hold',
    defaultSets: 4,
    holdSecMin: 30,
    holdSecMax: 45,
    restSecMin: 45,
    restSecMax: 60,
    notes: 'Squeeze palla tra le cosce. Posizione seduta o supina.',
  },
  {
    name: 'Lateral Band Walk / Abduzione Anca',
    variant: 'reps_per_side',
    defaultSets: 3,
    repsMin: 10,
    repsMax: 12,
    restSecMin: 60,
    restSecMax: 75,
    notes: '10–12 reps per lato. Banda mini attorno alle caviglie. Posizione semi-squat.',
  },
  {
    name: 'Ricarico Ginocchio: TKE / Step-Up / Box Squat',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 8,
    repsMax: 12,
    restSecMin: 60,
    restSecMax: 90,
    notes: 'Progressivo: inizia con TKE con elastico → step-up → box squat. No dolore.',
  },
  {
    name: 'Polpacci da Seduto',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 8,
    repsMax: 12,
    restSecMin: 60,
    restSecMax: 75,
    notes: 'Solleva i talloni lentamente. Pausa in contrazione massima.',
  },
  {
    name: 'Core: Crunch Machine / Leg Raises',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 12,
    repsMax: 20,
    restSecMin: 60,
    restSecMax: 90,
    notes: '3–4 serie. Alternare gli esercizi se possibile.',
  },
];

export const kneeRoutine: Exercise[] = [
  {
    name: 'Bike / Cyclette',
    variant: 'hold',
    defaultSets: 1,
    holdSecMin: 180,
    holdSecMax: 300,
    restSecMin: 0,
    restSecMax: 0,
    notes: '3–5 minuti a ritmo leggero di riscaldamento.',
  },
  {
    name: 'Quad Set',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 15,
    repsMax: 20,
    restSecMin: 30,
    restSecMax: 60,
    notes: 'Contrazione quadricipite supino. Tenuta 5–10 sec per ripetizione.',
  },
  {
    name: 'Isometria Knee Extension Seduto',
    variant: 'hold',
    defaultSets: 3,
    holdSecMin: 30,
    holdSecMax: 45,
    restSecMin: 30,
    restSecMax: 60,
    notes: 'Gamba a 45–60° di flessione. No dolore acuto.',
  },
  {
    name: 'TKE con Elastico',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 12,
    repsMax: 15,
    restSecMin: 30,
    restSecMax: 60,
    notes: 'Terminal Knee Extension. Elastico dietro il ginocchio. Estensione completa.',
  },
  {
    name: 'Side-Lying Hip Abduction',
    variant: 'reps_per_side',
    defaultSets: 3,
    repsMin: 12,
    repsMax: 15,
    restSecMin: 30,
    restSecMax: 60,
    notes: 'Lento e controllato. Nessuna compensazione col bacino.',
  },
  {
    name: 'Mobilità Caviglia',
    variant: 'reps',
    defaultSets: 2,
    repsMin: 10,
    repsMax: 15,
    restSecMin: 0,
    restSecMax: 30,
    notes: 'Cerchi caviglia e dorsiflessione contro il muro.',
  },
];

export function getExercisesForScheda(scheda: Scheda): Exercise[] {
  switch (scheda) {
    case 'B': return schedaB;
    case 'D': return schedaD;
    default:  return []; // A, C, E — upper body; knee routine added optionally
  }
}

export function formatSetTarget(exercise: Exercise): string {
  const sets = exercise.defaultSets;
  if (exercise.variant === 'hold') {
    const min = exercise.holdSecMin ?? 0;
    const max = exercise.holdSecMax ?? 0;
    return min === max
      ? `${sets} × ${min}s`
      : `${sets} × ${min}–${max}s`;
  }
  const suffix = exercise.variant === 'reps_per_side' ? '/lato' : '';
  const min = exercise.repsMin ?? 0;
  const max = exercise.repsMax ?? 0;
  return min === max
    ? `${sets} × ${min}${suffix}`
    : `${sets} × ${min}–${max}${suffix}`;
}

export function formatRestRange(exercise: Exercise): string {
  const { restSecMin, restSecMax } = exercise;
  if (restSecMin === 0 && restSecMax === 0) return '—';
  if (restSecMin === restSecMax) return `${restSecMin}s`;
  return `${restSecMin}–${restSecMax}s`;
}
