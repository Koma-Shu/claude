-- Run this SQL in the Supabase SQL Editor to set up the required tables

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  full_name text not null,
  birth_date date not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (allow all via anon key for this project)
alter table users enable row level security;
create policy "allow all" on users for all using (true) with check (true);

-- Per-game ratings
create table if not exists user_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  game text not null,
  rating integer not null default 1500,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  unique(user_id, game)
);
alter table user_ratings enable row level security;
create policy "allow all" on user_ratings for all using (true) with check (true);

-- Chat messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references users(id) on delete cascade,
  receiver_id uuid not null references users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);
alter table chat_messages enable row level security;
create policy "allow all" on chat_messages for all using (true) with check (true);
