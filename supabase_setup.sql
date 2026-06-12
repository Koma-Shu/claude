-- ============================================================
-- ARCADE Game System — Supabase Setup SQL
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  full_name     text not null,
  birth_date    date not null,
  password_hash text not null,
  email         text unique,
  email_verified boolean not null default false,
  otp_code      text,
  otp_expires   timestamptz,
  created_at    timestamptz not null default now()
);
alter table users enable row level security;
drop policy if exists "allow all" on users;
create policy "allow all" on users for all using (true) with check (true);

-- ── Per-game ratings / comments ───────────────────────────────
create table if not exists ratings (
  id         uuid primary key default gen_random_uuid(),
  game       text not null,
  stars      integer not null check (stars between 1 and 5),
  comment    text,
  user_id    uuid references users(id) on delete set null,
  username   text,
  created_at timestamptz not null default now()
);
alter table ratings enable row level security;
drop policy if exists "allow all" on ratings;
create policy "allow all" on ratings for all using (true) with check (true);

-- ── User game ratings (win/loss/draw) ────────────────────────
create table if not exists user_ratings (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references users(id) on delete cascade,
  game     text not null,
  rating   integer not null default 1500,
  wins     integer not null default 0,
  losses   integer not null default 0,
  draws    integer not null default 0,
  unique(user_id, game)
);
alter table user_ratings enable row level security;
drop policy if exists "allow all" on user_ratings;
create policy "allow all" on user_ratings for all using (true) with check (true);

-- ── Friends ───────────────────────────────────────────────────
-- status: 'pending' | 'accepted'
create table if not exists friends (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references users(id) on delete cascade,
  addressee_id uuid not null references users(id) on delete cascade,
  status       text not null default 'pending',
  created_at   timestamptz not null default now(),
  unique(requester_id, addressee_id)
);
alter table friends enable row level security;
drop policy if exists "allow all" on friends;
create policy "allow all" on friends for all using (true) with check (true);

-- ── Direct chat messages (friends only) ──────────────────────
create table if not exists chat_messages (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references users(id) on delete cascade,
  receiver_id uuid not null references users(id) on delete cascade,
  message     text not null,
  created_at  timestamptz not null default now()
);
alter table chat_messages enable row level security;
drop policy if exists "allow all" on chat_messages;
create policy "allow all" on chat_messages for all using (true) with check (true);

-- ── Group chats ───────────────────────────────────────────────
create table if not exists group_chats (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_by uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table group_chats enable row level security;
drop policy if exists "allow all" on group_chats;
create policy "allow all" on group_chats for all using (true) with check (true);

create table if not exists group_members (
  group_id  uuid not null references group_chats(id) on delete cascade,
  user_id   uuid not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
alter table group_members enable row level security;
drop policy if exists "allow all" on group_members;
create policy "allow all" on group_members for all using (true) with check (true);

create table if not exists group_messages (
  id        uuid primary key default gen_random_uuid(),
  group_id  uuid not null references group_chats(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  message   text not null,
  created_at timestamptz not null default now()
);
alter table group_messages enable row level security;
drop policy if exists "allow all" on group_messages;
create policy "allow all" on group_messages for all using (true) with check (true);

-- ── Play sessions (利用回数・利用時間の記録) ──────────────────
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

-- ── Online game rooms ─────────────────────────────────────────
create table if not exists rooms (
  id             text primary key,
  game           text not null,
  state          jsonb,
  player1_token  text,
  player2_token  text,
  status         text default 'waiting',
  updated_at     timestamptz default now()
);
alter table rooms enable row level security;
drop policy if exists "allow all" on rooms;
create policy "allow all" on rooms for all using (true) with check (true);
