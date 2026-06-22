-- ============================================================
-- ENGLISH app (口頭英作文 学習マネージャー)
-- Supabase migration v6 — per-user learning-state cloud sync
-- Run this in the Supabase SQL Editor (idempotent — safe to re-run).
--
-- Stores ONE row per user holding the whole English-app learning state
-- (lessons / routine / activity / settings) as JSON, so a user's progress
-- follows their account across devices and browsers. `english-sync.js` merges
-- field-by-field on pull (per-lesson by modified time, activity by max,
-- routine by OR, settings by modified time) so no device loses data.
-- Sync runs only when logged in; guests stay device-local.
--
-- Privacy note: like the rest of this app it uses the publishable anon key
-- with an "allow all" policy. Diary API keys are intentionally NOT synced —
-- they remain on the device only.
-- ============================================================

create table if not exists english_progress (
  user_id    uuid primary key references users(id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,  -- eng_v1 blob: { lessons, config, routine, act }
  updated_at timestamptz not null default now()
);

create index if not exists english_progress_updated_idx on english_progress(updated_at);

alter table english_progress enable row level security;
drop policy if exists "allow all" on english_progress;
create policy "allow all" on english_progress for all using (true) with check (true);
