-- KneeRecoveryTracker — initial schema
-- Single-user personal app. RLS is intentionally disabled.
-- The publishable/anon key is the only client; no auth required.

create extension if not exists "pgcrypto";

create table if not exists workout_sessions (
  id          uuid primary key default gen_random_uuid(),
  scheda      text not null,            -- 'A' | 'B' | 'C' | 'D' | 'E'
  date        date not null,
  start_ts    timestamptz,
  end_ts      timestamptz,
  created_at  timestamptz default now()
);

create table if not exists session_sets (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid references workout_sessions(id) on delete cascade,
  exercise_name  text not null,
  set_number     integer not null,
  weight_kg      numeric,               -- null for bodyweight / isometric
  reps           integer,               -- null for timed holds
  hold_seconds   integer,               -- null for rep-based
  note           text,
  logged_at      timestamptz default now()
);

create table if not exists session_feedback (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid references workout_sessions(id) on delete cascade,
  difficulty    integer,                -- 1–10
  energy        integer,                -- 1–10
  pain_left     integer,                -- 0–10
  pain_right    integer,                -- 0–10
  swelling_left integer,                -- 0–10
  notes         text,
  created_at    timestamptz default now()
);

alter table workout_sessions  disable row level security;
alter table session_sets      disable row level security;
alter table session_feedback  disable row level security;
