-- ============================================================
-- ARCADE — Online multiplayer rooms (オンライン対戦)
-- Supabase migration v4 — run this in the Supabase SQL Editor.
-- Idempotent: safe to run on a fresh OR existing database.
--
-- WHY: online play (createRoom / joinRoom / pushState in netplay.js and the
-- inline online code in reversi/gomoku/chess/shogi) needs the `rooms` table
-- with an open RLS policy. If login works but "オンライン対戦" does not, this
-- table is almost certainly missing or its policy is off — running this fixes it.
-- ============================================================

create table if not exists rooms (
  id             text primary key,            -- 6-char room code
  game           text not null,               -- which game
  state          jsonb,                       -- full game state, synced by polling
  player1_token  text,
  player2_token  text,
  status         text default 'waiting',      -- 'waiting' | 'playing'
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- If the table already existed without these columns, add them.
alter table rooms add column if not exists state         jsonb;
alter table rooms add column if not exists player1_token text;
alter table rooms add column if not exists player2_token text;
alter table rooms add column if not exists status        text default 'waiting';
alter table rooms add column if not exists created_at    timestamptz default now();
alter table rooms add column if not exists updated_at    timestamptz default now();

-- RLS: the app uses the public (anon/publishable) key, so an open policy is
-- required for both players to read & write the shared room.
alter table rooms enable row level security;
drop policy if exists "allow all" on rooms;
create policy "allow all" on rooms for all using (true) with check (true);

create index if not exists rooms_game_idx    on rooms(game);
create index if not exists rooms_status_idx   on rooms(status);
create index if not exists rooms_updated_idx  on rooms(updated_at);

-- Quick self-check (optional): after running the above, this should succeed.
--   insert into rooms (id, game, state, status) values ('TEST00','reversi','{}','waiting');
--   select id, game, status from rooms where id = 'TEST00';
--   delete from rooms where id = 'TEST00';
-- ============================================================
