-- ============================================================
-- ARCADE — Migration SQL v2 (既存DBへの差分適用)
-- Supabase SQL Editor で実行してください
--
-- 追加内容: play_sessions テーブル
--   各ゲームページの track.js がプレイセッション（ゲーム名・
--   ユーザ・プレイ秒数）を記録します。管理者画面（admin.html）の
--   「利用回数」「利用時間」表示のデータソースです。
-- ============================================================

create table if not exists play_sessions (
  id         uuid primary key default gen_random_uuid(),
  game       text not null,
  user_id    uuid references users(id) on delete set null,
  username   text,
  seconds    integer not null default 0,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists play_sessions_game_idx    on play_sessions(game);
create index if not exists play_sessions_user_idx    on play_sessions(user_id);
create index if not exists play_sessions_started_idx on play_sessions(started_at);
alter table play_sessions enable row level security;
drop policy if exists "allow all" on play_sessions;
create policy "allow all" on play_sessions for all using (true) with check (true);
