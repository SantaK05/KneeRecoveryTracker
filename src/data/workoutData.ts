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
    name: 'Riscaldamento lower',
    variant: 'hold',
    defaultSets: 1,
    holdSecMin: 600,
    holdSecMax: 600,
    restSecMin: 0,
    restSecMax: 0,
    notes: 'Usa il riscaldamento comune. Se il sinistro non scorre, ripeti quad set + TKE prima dei carichi.',
  },
  {
    name: 'Stacco rumeno manubri',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 6,
    repsMax: 8,
    restSecMin: 120,
    restSecMax: 120,
    notes: 'RPE 7 | Stesso pattern della scheda normale. Cerca femorali/glutei, non ginocchio. Tibia quasi verticale.',
  },
  {
    name: 'Adductor machine controllata',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 12,
    repsMax: 15,
    restSecMin: 75,
    restSecMax: 90,
    notes: 'RPE 6–7 | Mantieni ROM tollerato, niente chiusura aggressiva se senti fastidio mediale. Se irrita: adduttori isometrici con palla 4 × 30–45 sec.',
  },
  {
    name: 'Leg extension terapeutica al posto dello squat – versione A',
    variant: 'hold',
    defaultSets: 5,
    holdSecMin: 30,
    holdSecMax: 45,
    restSecMin: 45,
    restSecMax: 60,
    notes: 'Settimane 1–2 o giorni reattivi: isometria a circa 60° di flessione. Intensità 50–70%, dolore ≤3/10, niente tremore/test massimale. LOGICA: 🔴 Solo questa versione se: ginocchio sinistro impastato, fastidio dopo seduta, dolore >2/10 nel warm-up.',
  },
  {
    name: 'Leg extension terapeutica al posto dello squat – versione B',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 10,
    repsMax: 12,
    restSecMin: 75,
    restSecMax: 90,
    notes: 'RPE 5–6 | Se il ginocchio è tranquillo: ROM 90–45°, senza lockout e senza ultimi 40°. Stop se compare pinzamento o attrito che aumenta. LOGICA: 🟢 Usa questa se: warm-up ok, dolore 0–2/10, nessun flare dalla seduta precedente (24h).',
  },
  {
    name: 'Leg curl sdraiato',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 10,
    repsMax: 12,
    restSecMin: 90,
    restSecMax: 90,
    notes: 'RPE 7 | Più metabolico della B, senza forzare la contrazione finale se irrita il mediale.',
  },
  {
    name: 'Leg extension pump controllato',
    variant: 'reps',
    defaultSets: 2,
    repsMin: 12,
    repsMax: 15,
    restSecMin: 75,
    restSecMax: 90,
    notes: 'RPE 5–6 | Solo se la leg extension terapeutica è stata tollerata. ROM 90–45°, pompaggio leggero, nessun lockout. Se c\'è dubbio, elimina questa seconda esposizione.',
  },
  {
    name: 'Crunch machine / leg raises',
    variant: 'reps',
    defaultSets: 3,
    repsMin: 12,
    repsMax: 20,
    restSecMin: 60,
    restSecMax: 90,
    notes: 'Mantieni come scheda originale se non dà fastidio ad anca dx o ginocchio. Se irrita: dead bug o pallof press.',
  },
  {
    name: 'Polpacci da seduto',
    variant: 'reps',
    defaultSets: 4,
    repsMin: 8,
    repsMax: 12,
    restSecMin: 60,
    restSecMax: 75,
    notes: 'Mantieni se la posizione seduta non irrita il ginocchio. In caso contrario: calf in piedi o alla pressa con ginocchio morbido.',
  },
];

// Progressione interna e gestione dolore per Scheda D
export const schedaDProgression = {
  weeks1to2: 'RDL e adductor controllati; al posto dello squat usa leg extension isometrica 5 × 30–45 sec. La leg extension pump finale solo se zero reattività.',
  weeks3to4: 'Se nessun peggioramento nelle 24h, passa alla leg extension parziale 90–45° 3 × 10–12 @RPE 5–6. Mantieni la seconda leg extension a 2 × 12–15 leggera o eliminala se senti troppo stimolo locale.',
  weeks5to6: 'Puoi portare la leg extension terapeutica a 3 × 12–15 @RPE 6–7 o aggiungere 1 set, ma non entrambe le cose. Ancora no lockout pesante.',
  week7plus: 'Se hai 10–14 giorni puliti, puoi iniziare a riaprire gradualmente il ROM, ma la parte 40–0° resta l\'ultima da caricare in modo serio.',
};

// Regola dolore per tutti gli esercizi (mostrata in app)
export const painManagementRule = {
  '0-2': { action: 'Procedi', detail: 'Puoi aumentare UNA variabile: +1–2 reps oppure +2,5–5% carico oppure +1 set' },
  '3': { action: 'Mantieni', detail: 'Se migliora durante la serie: mantieni stesso dosaggio 1 settimana' },
  '4': { action: 'Stop/Regressione', detail: 'Immediatamente o se cambia la tecnica' },
  'next_day': { action: 'Riduci', detail: 'Se peggioramento il giorno dopo: riduci 25–50% volume/carico per 3–7 giorni' },
};

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
