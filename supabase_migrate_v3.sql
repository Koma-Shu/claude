-- ============================================================
-- STUDY app (SPI / 玉手箱 / TG-WEB / ケース面接 / フェルミ推定)
-- Supabase migration v3 — spaced-repetition progress
-- Run this in the Supabase SQL Editor (idempotent — safe to re-run).
--
-- Stores one row per (user, problem) holding the SM-2 scheduler state used by
-- srs.js. The forgetting-curve scheduler reads/writes these fields so a user's
-- review schedule and accuracy follow their account across devices.
-- ============================================================

create table if not exists study_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  item_id       text not null,                      -- problem id from study-data.js
  ef            real    not null default 2.5,        -- SM-2 easiness factor (>= 1.3)
  reps          integer not null default 0,          -- consecutive successful reviews
  interval_days real    not null default 0,          -- current scheduling interval (days)
  due           timestamptz,                         -- next review time
  lapses        integer not null default 0,          -- times forgotten
  attempts      integer not null default 0,          -- total reviews
  correct       integer not null default 0,          -- passing reviews
  last_reviewed timestamptz,                         -- timestamp of the last review
  added_at      timestamptz not null default now(),  -- first-seen time
  updated_at    timestamptz not null default now(),
  unique (user_id, item_id)
);

create index if not exists study_progress_user_idx on study_progress(user_id);
create index if not exists study_progress_due_idx  on study_progress(user_id, due);

alter table study_progress enable row level security;
drop policy if exists "allow all" on study_progress;
create policy "allow all" on study_progress for all using (true) with check (true);

-- Optional: a raw review log (analytics / future graphs). Not required by srs.js.
create table if not exists study_reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  item_id     text not null,
  cat         text,                                  -- track (spi-num, fermi, …)
  quality     integer,                               -- SM-2 quality 0..5
  correct     boolean,
  created_at  timestamptz not null default now()
);
create index if not exists study_reviews_user_idx on study_reviews(user_id);
create index if not exists study_reviews_time_idx on study_reviews(created_at);

alter table study_reviews enable row level security;
drop policy if exists "allow all" on study_reviews;
create policy "allow all" on study_reviews for all using (true) with check (true);
