# KneeRecoveryTracker

Personal training tracker for a knee recovery protocol. Tracks Scheda B and D lower body workouts with set logging, rest timers, and feedback. Syncs to Supabase in the background.

## Tech Stack

- Expo SDK 55 / React Native 0.83
- TypeScript
- React Navigation v7 (native stack + bottom tabs)
- Supabase JS v2 (fire-and-forget background sync)
- expo-haptics (set completion feedback)
- @react-native-community/slider (feedback sliders)

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-publishable-or-anon-key
```

The `.env` file is already set up with the project's Supabase credentials.

### 3. Apply database migration

In the Supabase dashboard, open the SQL editor and run:

```
supabase/migrations/001_init.sql
```

Or using the Supabase CLI:

```bash
supabase db push
```

This creates the three tables (`workout_sessions`, `session_sets`, `session_feedback`) with RLS disabled (single-user personal app).

### 4. Run a development build

Since the app uses native modules (`expo-haptics`, `@react-native-community/slider`), you need a development build — it will not work in Expo Go.

**Android:**

```bash
eas build --platform android --profile development
```

After the build installs on your device:

```bash
npx expo start --dev-client
```

**iOS:**

```bash
eas build --platform ios --profile development
```

Then start the dev server:

```bash
npx expo start --dev-client
```

### 5. Rebuild after adding native modules

Any time you `npm install` a package with native code, rebuild the development client:

```bash
eas build --platform android --profile development
# or
eas build --platform ios --profile development
```

## Screens

| Screen | Description |
|---|---|
| Home | Date, scheda selector (A–E), session timer, start button |
| ExerciseList | List of exercises for the selected scheda with completion indicators |
| ExerciseDetail | Set logging with weight/reps/hold inputs and automatic rest countdown |
| Feedback | Post-workout sliders (difficulty, energy, knee pain) and free notes |
| History | Past sessions sorted by date with average knee pain indicator |
| SessionDetail | All logged sets and feedback for a completed session |

## Workout Data

- **Scheda B / D**: Full lower body workout with all exercises logged
- **Scheda A / C / E**: Upper body — session timer only; optional "Routine Ginocchio" block (6 knee rehab exercises)

## Data Architecture

All state lives in `WorkoutContext` (React Context + `useReducer`). Every write to Supabase is fire-and-forget:

1. Optimistic local state update (instant UI)
2. Background Supabase insert/update (non-blocking)
3. Silent single retry after 5 seconds on failure
4. No loading spinners for writes
