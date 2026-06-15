-- ============================================================
-- ARCADE — Online relay messages (消しバトのオンライン対戦用)
-- Supabase migration v5 — run this in the Supabase SQL Editor (idempotent).
--
-- 消しバト(keshibato) は元々 WebRTC(P2P) で対戦していたが、TURN サーバが無いと
-- 多くの回線(モバイル/厳しいNAT)で接続できないため、他ゲームと同じ Supabase 中継
-- 方式に変更した。ホスト/ゲストはこの append-only ログにメッセージを INSERT し、
-- それぞれ新着行をポーリングで取得して同期する（書き込み競合が起きない設計）。
--
-- 併せて supabase_migrate_v4.sql（rooms テーブル）も必要です。
-- ============================================================

create table if not exists room_messages (
  id         uuid primary key default gen_random_uuid(),
  room       text not null,                 -- room code
  seq        bigint generated always as identity,  -- monotonic order
  sender     text not null,                 -- 'host' or a guest id
  payload    jsonb not null,                -- the game message
  created_at timestamptz not null default now()
);

create index if not exists room_messages_room_seq_idx on room_messages(room, seq);

alter table room_messages enable row level security;
drop policy if exists "allow all" on room_messages;
create policy "allow all" on room_messages for all using (true) with check (true);

-- Optional housekeeping: delete messages older than a day to keep the table small.
-- delete from room_messages where created_at < now() - interval '1 day';
-- ============================================================
