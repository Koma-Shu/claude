-- HTML Viewer: クラウド同期用テーブル（Supabase の SQL Editor で一度だけ実行）
-- 各ユーザーは自分の行だけを読み書きできる（Row Level Security）。

create table if not exists public.hv_folders (
  user_id           uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  id                text        not null,
  name              text        not null default '',
  parent_id         text,
  hidden            boolean     not null default false,
  updated_at        bigint      not null default 0,
  deleted           boolean     not null default false,
  server_updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.hv_files (
  user_id           uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  id                text        not null,
  name              text        not null default '',
  title             text        not null default '',
  text              text        not null default '',
  html              text        not null default '',
  size              integer     not null default 0,
  hash              text        not null default '',
  tags              text[]      not null default '{}',
  fav               boolean     not null default false,
  kv                jsonb       not null default '{}'::jsonb,
  folder_id         text,
  added_at          bigint      not null default 0,
  updated_at        bigint      not null default 0,
  opened_at         bigint      not null default 0,
  deleted           boolean     not null default false,
  server_updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists hv_folders_sync on public.hv_folders (user_id, server_updated_at);
create index if not exists hv_files_sync   on public.hv_files   (user_id, server_updated_at);

-- 差分取得のため、書き込みのたびにサーバー時刻を記録する
create or replace function public.hv_touch() returns trigger
language plpgsql as $$
begin
  new.server_updated_at := clock_timestamp();
  return new;
end $$;

drop trigger if exists hv_folders_touch on public.hv_folders;
create trigger hv_folders_touch before insert or update on public.hv_folders
  for each row execute function public.hv_touch();

drop trigger if exists hv_files_touch on public.hv_files;
create trigger hv_files_touch before insert or update on public.hv_files
  for each row execute function public.hv_touch();

alter table public.hv_folders enable row level security;
alter table public.hv_files   enable row level security;

drop policy if exists "own folders" on public.hv_folders;
create policy "own folders" on public.hv_folders for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "own files" on public.hv_files;
create policy "own files" on public.hv_files for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select, insert, update, delete on public.hv_folders to authenticated;
grant select, insert, update, delete on public.hv_files   to authenticated;
