-- ============================================================
-- ARCADE — Migration SQL (既存DBへの差分適用)
-- Supabase SQL Editor で実行してください
-- ============================================================

-- ── 1. users テーブルに列を追加 ───────────────────────────
alter table users add column if not exists email         text unique;
alter table users add column if not exists email_verified boolean not null default false;
alter table users add column if not exists otp_code      text;
alter table users add column if not exists otp_expires   timestamptz;

-- ── 2. ratings テーブルに列を追加 ────────────────────────
alter table ratings add column if not exists user_id  uuid references users(id) on delete set null;
alter table ratings add column if not exists username  text;

-- ── 3. friends テーブル（新規）────────────────────────────
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

-- ── 4. group_chats テーブル（新規）──────────────────────
create table if not exists group_chats (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_by uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table group_chats enable row level security;
drop policy if exists "allow all" on group_chats;
create policy "allow all" on group_chats for all using (true) with check (true);

-- ── 5. group_members テーブル（新規）────────────────────
create table if not exists group_members (
  group_id  uuid not null references group_chats(id) on delete cascade,
  user_id   uuid not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
alter table group_members enable row level security;
drop policy if exists "allow all" on group_members;
create policy "allow all" on group_members for all using (true) with check (true);

-- ── 6. group_messages テーブル（新規）───────────────────
create table if not exists group_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references group_chats(id) on delete cascade,
  sender_id  uuid not null references users(id) on delete cascade,
  message    text not null,
  created_at timestamptz not null default now()
);
alter table group_messages enable row level security;
drop policy if exists "allow all" on group_messages;
create policy "allow all" on group_messages for all using (true) with check (true);
