-- ============================================================
-- ARCADE — Migration v7: セキュリティの根本対策（必ず実行）
-- Supabase の SQL Editor で一度実行する（何度実行しても安全）。
--
-- これまで全テーブルが「誰でも全操作可（allow all）」で、公開されている
-- publishable キーさえあれば、全ユーザーの個人情報・パスワードハッシュ・
-- チャットを誰でも読み書きできた。この SQL で次のように変える。
--
--  1. パスワードの照合をサーバー側（関数）で行い、bcrypt で保存し直す。
--     既存ユーザーの SHA-256 は、次回ログイン時に自動で bcrypt に置き換わる。
--  2. ログインすると推測不能なセッショントークンを発行し、ブラウザは
--     リクエストヘッダー x-arcade-session で送る（sbauth.js）。
--     各テーブルの RLS はこのトークンから「誰のリクエストか」を判定する。
--  3. users テーブルは本人と管理者だけが読める。パスワードハッシュと
--     確認コードは誰も API から読めない。他人の表示は profiles ビュー経由で、
--     氏名は本人・友達・自分に申請してきた相手にだけ見える。
--  4. 管理画面は users.is_admin = true のアカウントでログインした時だけ使える。
--
-- オンライン対戦の rooms / room_messages / mahjong_rooms は、ゲスト同士でも
-- 遊べるよう従来どおり公開のまま（盤面の状態だけで個人情報は無い）。
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ── users: ログイン試行回数・管理者フラグ ────────────────────
alter table public.users add column if not exists is_admin       boolean     not null default false;
alter table public.users add column if not exists failed_logins  integer     not null default 0;
alter table public.users add column if not exists locked_until   timestamptz;

-- これまでクライアントで生成・保存していた確認コードは不要
update public.users set otp_code = null, otp_expires = null where otp_code is not null;

-- 旧管理画面は username = 'admin' のログインを管理者として扱っていた。同じ扱いを引き継ぐ。
-- 別のアカウントを管理者にする場合は、下の 'admin' をそのユーザーIDに変えて実行する。
update public.users set is_admin = true where username = 'admin';

-- ── セッション ───────────────────────────────────────────────
create table if not exists public.arcade_sessions (
  token_hash text        primary key,              -- トークンの SHA-256（トークンそのものは保存しない）
  user_id    uuid        not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists arcade_sessions_user_idx on public.arcade_sessions(user_id);
alter table public.arcade_sessions enable row level security;   -- ポリシー無し = API から一切触れない
revoke all on public.arcade_sessions from anon, authenticated;

-- リクエストヘッダーのトークンから、ログイン中のユーザーIDを返す（未ログインは null）
create or replace function public.arcade_uid() returns uuid
language sql stable security definer set search_path = public, extensions as $$
  select s.user_id
  from public.arcade_sessions s
  where s.token_hash = encode(digest(coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'x-arcade-session', ''), 'sha256'), 'hex')
    and s.expires_at > now()
$$;

create or replace function public.arcade_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select u.is_admin from public.users u where u.id = public.arcade_uid()), false)
$$;

create or replace function public.arcade_are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.friends f
    where f.status = 'accepted'
      and ((f.requester_id = a and f.addressee_id = b) or (f.requester_id = b and f.addressee_id = a))
  )
$$;

create or replace function public.arcade_is_member(gid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_members m where m.group_id = gid and m.user_id = public.arcade_uid())
      or exists (select 1 from public.group_chats g where g.id = gid and g.created_by = public.arcade_uid())
$$;

create or replace function public.arcade_owns_group(gid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_chats g where g.id = gid and g.created_by = public.arcade_uid())
$$;

-- ── ログイン / ログアウト / 登録（パスワードはサーバー側でだけ扱う） ──
create or replace function public.arcade_login(p_username text, p_password text) returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
declare
  u   public.users;
  ok  boolean;
  tok text;
begin
  select * into u from public.users where username = p_username;
  if not found then
    perform pg_sleep(0.3);
    return null;
  end if;
  if u.locked_until is not null and u.locked_until > now() then
    raise exception 'locked' using errcode = 'P0001';
  end if;

  if u.password_hash like '$2%' then
    ok := u.password_hash = crypt(p_password, u.password_hash);
  else
    -- 旧方式（ソルトなし SHA-256）。一致したらその場で bcrypt に置き換える
    ok := u.password_hash = encode(digest(p_password, 'sha256'), 'hex');
    if ok then
      update public.users set password_hash = crypt(p_password, gen_salt('bf', 10)) where id = u.id;
    end if;
  end if;

  if not ok then
    update public.users
       set failed_logins = failed_logins + 1,
           locked_until  = case when failed_logins + 1 >= 10 then now() + interval '15 minutes' else locked_until end
     where id = u.id;
    return null;
  end if;

  update public.users set failed_logins = 0, locked_until = null where id = u.id;
  delete from public.arcade_sessions where expires_at < now();
  tok := encode(gen_random_bytes(32), 'hex');
  insert into public.arcade_sessions(token_hash, user_id, expires_at)
       values (encode(digest(tok, 'sha256'), 'hex'), u.id, now() + interval '30 days');
  return json_build_object('token', tok, 'user',
    json_build_object('id', u.id, 'username', u.username, 'full_name', u.full_name, 'is_admin', u.is_admin));
end $$;

create or replace function public.arcade_logout() returns void
language sql volatile security definer set search_path = public, extensions as $$
  delete from public.arcade_sessions
  where token_hash = encode(digest(coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'x-arcade-session', ''), 'sha256'), 'hex')
$$;

create or replace function public.arcade_check_available(p_username text, p_email text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'username_taken', exists (select 1 from public.users where username = p_username),
    'email_taken',    exists (select 1 from public.users where lower(email) = lower(p_email)))
$$;

create or replace function public.arcade_register(p_username text, p_full_name text, p_birth date, p_email text, p_password text)
returns json
language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  if p_username !~ '^[A-Za-z0-9_]{1,20}$' then raise exception 'invalid_username' using errcode = 'P0001'; end if;
  if length(coalesce(p_password, '')) < 8 then raise exception 'weak_password' using errcode = 'P0001'; end if;
  if coalesce(trim(p_full_name), '') = '' or p_birth is null then raise exception 'missing_fields' using errcode = 'P0001'; end if;
  if p_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then raise exception 'invalid_email' using errcode = 'P0001'; end if;
  if exists (select 1 from public.users where username = p_username) then raise exception 'username_taken' using errcode = 'P0001'; end if;
  if exists (select 1 from public.users where lower(email) = lower(p_email)) then raise exception 'email_taken' using errcode = 'P0001'; end if;
  insert into public.users(username, full_name, birth_date, email, email_verified, password_hash)
       values (p_username, trim(p_full_name), p_birth, p_email, true, crypt(p_password, gen_salt('bf', 10)));
  return json_build_object('ok', true);
end $$;

grant execute on function public.arcade_login(text, text), public.arcade_logout(), public.arcade_check_available(text, text),
  public.arcade_register(text, text, date, text, text) to anon, authenticated;

-- ── users: 本人と管理者だけ。パスワードハッシュ等の列は API から読めない ──
revoke all on public.users from anon, authenticated;
grant select (id, username, full_name, birth_date, email, email_verified, created_at, is_admin) on public.users to anon, authenticated;
drop policy if exists "allow all" on public.users;
drop policy if exists "users self or admin" on public.users;
create policy "users self or admin" on public.users for select using (id = public.arcade_uid() or public.arcade_is_admin());

-- 他のユーザーの表示用（ユーザーIDは誰でも、氏名は本人・友達・自分に申請してきた相手だけ）
create or replace view public.profiles as
  select u.id, u.username,
         case when u.id = public.arcade_uid()
                or public.arcade_is_admin()
                or public.arcade_are_friends(u.id, public.arcade_uid())
                or exists (select 1 from public.friends f
                           where f.requester_id = u.id and f.addressee_id = public.arcade_uid() and f.status = 'pending')
              then u.full_name end as full_name
  from public.users u;
grant select on public.profiles to anon, authenticated;

-- ── friends ──────────────────────────────────────────────────
revoke update, delete on public.friends from anon, authenticated;
grant update (status) on public.friends to anon, authenticated;
grant delete on public.friends to anon, authenticated;
drop policy if exists "allow all" on public.friends;
drop policy if exists "friends read" on public.friends;
drop policy if exists "friends request" on public.friends;
drop policy if exists "friends accept" on public.friends;
drop policy if exists "friends remove" on public.friends;
create policy "friends read" on public.friends for select
  using (requester_id = public.arcade_uid() or addressee_id = public.arcade_uid() or public.arcade_is_admin());
create policy "friends request" on public.friends for insert
  with check (requester_id = public.arcade_uid() and addressee_id <> requester_id and status = 'pending');
create policy "friends accept" on public.friends for update
  using (addressee_id = public.arcade_uid()) with check (addressee_id = public.arcade_uid() and status = 'accepted');
create policy "friends remove" on public.friends for delete
  using (requester_id = public.arcade_uid() or addressee_id = public.arcade_uid());

-- ── chat_messages: 当事者だけ。送れるのは友達宛てだけ ─────────
revoke update, delete on public.chat_messages from anon, authenticated;
drop policy if exists "allow all" on public.chat_messages;
drop policy if exists "dm read" on public.chat_messages;
drop policy if exists "dm send" on public.chat_messages;
create policy "dm read" on public.chat_messages for select
  using (sender_id = public.arcade_uid() or receiver_id = public.arcade_uid());
create policy "dm send" on public.chat_messages for insert
  with check (sender_id = public.arcade_uid() and public.arcade_are_friends(sender_id, receiver_id));

-- ── グループチャット: メンバーだけ ────────────────────────────
revoke update, delete on public.group_chats from anon, authenticated;
drop policy if exists "allow all" on public.group_chats;
drop policy if exists "groups read" on public.group_chats;
drop policy if exists "groups create" on public.group_chats;
create policy "groups read" on public.group_chats for select
  using (created_by = public.arcade_uid() or public.arcade_is_member(id));
create policy "groups create" on public.group_chats for insert
  with check (created_by = public.arcade_uid());

revoke update on public.group_members from anon, authenticated;
drop policy if exists "allow all" on public.group_members;
drop policy if exists "members read" on public.group_members;
drop policy if exists "members add" on public.group_members;
drop policy if exists "members leave" on public.group_members;
create policy "members read" on public.group_members for select
  using (user_id = public.arcade_uid() or public.arcade_is_member(group_id));
create policy "members add" on public.group_members for insert
  with check (public.arcade_owns_group(group_id));
create policy "members leave" on public.group_members for delete
  using (user_id = public.arcade_uid());

revoke update, delete on public.group_messages from anon, authenticated;
drop policy if exists "allow all" on public.group_messages;
drop policy if exists "group msg read" on public.group_messages;
drop policy if exists "group msg send" on public.group_messages;
create policy "group msg read" on public.group_messages for select
  using (public.arcade_is_member(group_id));
create policy "group msg send" on public.group_messages for insert
  with check (sender_id = public.arcade_uid() and public.arcade_is_member(group_id));

-- ── ゲームのレビュー（公開）: 投稿者名はサーバーが付ける ─────────
create or replace function public.arcade_stamp_username() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is not null then
    new.username := (select username from public.users where id = new.user_id);
  else
    new.username := null;
  end if;
  return new;
end $$;

revoke update, delete on public.ratings from anon, authenticated;
drop policy if exists "allow all" on public.ratings;
drop policy if exists "reviews read" on public.ratings;
drop policy if exists "reviews post" on public.ratings;
create policy "reviews read" on public.ratings for select using (true);
create policy "reviews post" on public.ratings for insert
  with check (user_id is null or user_id = public.arcade_uid());
drop trigger if exists ratings_stamp on public.ratings;
create trigger ratings_stamp before insert on public.ratings for each row execute function public.arcade_stamp_username();

-- ── 勝敗記録: 本人だけ書ける。本人と管理者が読める ───────────
revoke delete on public.user_ratings from anon, authenticated;
drop policy if exists "allow all" on public.user_ratings;
drop policy if exists "wl read" on public.user_ratings;
drop policy if exists "wl insert" on public.user_ratings;
drop policy if exists "wl update" on public.user_ratings;
create policy "wl read" on public.user_ratings for select using (user_id = public.arcade_uid() or public.arcade_is_admin());
create policy "wl insert" on public.user_ratings for insert with check (user_id = public.arcade_uid());
create policy "wl update" on public.user_ratings for update
  using (user_id = public.arcade_uid()) with check (user_id = public.arcade_uid());

-- ── プレイ時間: ゲストも記録できる。ログイン中の行は本人だけ ───
revoke delete on public.play_sessions from anon, authenticated;
drop policy if exists "allow all" on public.play_sessions;
drop policy if exists "play read" on public.play_sessions;
drop policy if exists "play insert" on public.play_sessions;
drop policy if exists "play update" on public.play_sessions;
create policy "play read" on public.play_sessions for select
  using (user_id is null or user_id = public.arcade_uid() or public.arcade_is_admin());
create policy "play insert" on public.play_sessions for insert
  with check (user_id is null or user_id = public.arcade_uid());
create policy "play update" on public.play_sessions for update
  using (user_id is null or user_id = public.arcade_uid()) with check (user_id is null or user_id = public.arcade_uid());
drop trigger if exists play_sessions_stamp on public.play_sessions;
create trigger play_sessions_stamp before insert on public.play_sessions for each row execute function public.arcade_stamp_username();

-- ── 学習記録（STUDY / ENGLISH）: 本人だけ。管理者は閲覧可 ──────
do $$
declare t text;
begin
  foreach t in array array['study_progress', 'study_reviews', 'english_progress'] loop
    if to_regclass('public.' || t) is not null then
      execute format('drop policy if exists "allow all" on public.%I', t);
      execute format('drop policy if exists "own read" on public.%I', t);
      execute format('drop policy if exists "own write" on public.%I', t);
      execute format('drop policy if exists "own update" on public.%I', t);
      execute format('drop policy if exists "own delete" on public.%I', t);
      execute format('create policy "own read" on public.%I for select using (user_id = public.arcade_uid() or public.arcade_is_admin())', t);
      execute format('create policy "own write" on public.%I for insert with check (user_id = public.arcade_uid())', t);
      execute format('create policy "own update" on public.%I for update using (user_id = public.arcade_uid()) with check (user_id = public.arcade_uid())', t);
      execute format('create policy "own delete" on public.%I for delete using (user_id = public.arcade_uid())', t);
    end if;
  end loop;
end $$;

-- ── スコア表（公開ランキング）: 見る・追加するのみ ─────────────
do $$
begin
  if to_regclass('public.scores') is not null then
    alter table public.scores enable row level security;
    execute 'revoke update, delete on public.scores from anon, authenticated';
    drop policy if exists "allow all" on public.scores;
    drop policy if exists "scores read" on public.scores;
    drop policy if exists "scores add" on public.scores;
    create policy "scores read" on public.scores for select using (true);
    create policy "scores add" on public.scores for insert with check (true);
  end if;
end $$;

-- ── オンライン対戦のルームは公開のまま。古いルームの削除は管理者だけ ──
-- （rooms / room_messages / mahjong_rooms の既存の allow all ポリシーは変更しない）
