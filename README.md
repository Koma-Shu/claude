# Claude

GitHub Pages で配信される PWA。公開URL: **https://koma-shu.github.io/claude/**

入口（ポータル）から **ARCADES**（ARCADE）と **Network**（パケットの旅）に分かれます。
個人用の **ENGLISH / STUDY** は非公開リポジトリ `Koma-Shu/personal-tools`（https://personal-tools.komatsugawashu.workers.dev/）へ移転しました。

## ディレクトリ構成

```
/                        ポータル・認証・共有ライブラリ・PWA アセット
├── index.html           入口ポータル（アプリを選ぶメニュー）
├── login/register/profile/friends/chat.html
├── admin.html           管理者画面（登録ユーザ・利用回数・利用時間など）
├── sw.js manifest.json icon-192/512.png
├── sbauth.js ratings.js sound.js track.js nav.js cards.js netplay.js   ← アプリ横断の共有ライブラリ
│     （sbauth.js: Supabase 接続先 ARCADE_SB とセッション付与 / ratings.js: ゲームの評価・コメント欄）
│
├── ARCADES/
│   ├── ARCADE/          arcade.html＋ゲーム20本
│   ├── ENGLISH/         移転先（personal-tools）への転送ページのみ
│   └── STUDY/           同上
│
├── Network/
│   └── packet-journey/  パケットの旅（ネットワーク通信の教育サイト・単一HTML）
│
└── Tools/
    └── html-viewer/     HTML Viewer（Claude 作成の HTML を iPhone / iPad で管理・閲覧する個人用 PWA）
```

各アプリはユーザー視点で独立していますが、ログインアカウント
（`users` テーブル / `arcade_user`）は共通です。

**ポータルに出すもの / 出さないもの**: 公開ポータルに常時表示するのは **ARCADE** と **NETWORK** のみ。
**ENGLISH・ADMIN は個人用のため admin ログイン時だけカードを表示**します（未掲載だが
直リンク・ブックマークからは到達可能な「アンリスト」方式）。

**検索避け（noindex）**: 個人用ページ（`admin.html` / `profile.html` / `friends.html` / `chat.html` /
`ARCADES/ENGLISH/*.html` とルートのリダイレクト用HTML）には
`<meta name="robots" content="noindex,nofollow,noarchive">` を入れてあり、検索エンジンの
インデックス対象から外れます。ポータル・ARCADE・NETWORK は通常どおりインデックス可。
※ `robots.txt` はオリジン直下（`https://koma-shu.github.io/robots.txt`）にしか効かず、
プロジェクトページのサブディレクトリに置いても読まれないため、ページ単位の `meta` で対応しています。

**リポジトリの公開範囲について**: このリポジトリは Public です。GitHub にはファイル単位の
公開/非公開設定は無く、Pages で配信している以上、ここに置いたファイルはすべて公開されます。
本当に他人に見せたくない内容はこのリポジトリに置かず、別の Private リポジトリで管理してください
（Private リポジトリからの Pages 配信は有料プランが必要で、しかも**配信されるサイト自体は公開**されます）。

**旧URLの互換**: ディレクトリ分割前の `english.html` / `english-diary.html` / `arcade.html`
はルートに**リダイレクト用の小さなHTML**を残してあり、既存のブックマークや
ホーム画面に追加した PWA から開いても新しい場所へ自動転送されます。

## HTML Viewer（個人用ツール）

`Tools/html-viewer/` は、Claude が作った HTML ファイルを iPhone / iPad で保存・整理・閲覧する PWA。
公開URL: https://koma-shu.github.io/claude/Tools/html-viewer/ （ポータル未掲載・noindex）。
ARCADE とは**別の Supabase プロジェクト**を使い、Supabase Auth + RLS で本人のデータだけを読み書きする。
詳細は [Tools/html-viewer/README.md](Tools/html-viewer/README.md)。

## ARCADE

`ARCADES/ARCADE/arcade.html` はブラウザゲーム集（リバーシ・将棋・麻雀・カードゲーム等）。各ゲームの
「← ARCADE」はこのゲーム一覧へ戻ります。

## Supabase セットアップ

新規構築時は `supabase_setup.sql` を Supabase SQL Editor で実行。

既存DBには差分のみ適用:

1. `supabase_migrate.sql` — フレンド / グループチャット関連
2. `supabase_migrate_v2.sql` — **play_sessions テーブル（利用回数・利用時間の記録に必須）**
3. `supabase_migrate_v3.sql` — **study_progress テーブル（学習進捗・復習スケジュールの保存に必須）**
4. `supabase_migrate_v4.sql` — **rooms テーブル（オンライン対戦に必須）**
5. `supabase_migrate_v5.sql` — **room_messages テーブル（消しバトのオンライン対戦に必須）**
6. `supabase_migrate_v6.sql` — **english_progress テーブル（ENGLISH の学習データをユーザごとにクラウド同期するのに必須）**

7. `supabase_migrate_v7_security.sql` — **セキュリティの根本対策（必須）**。全テーブルの「誰でも全操作可」をやめ、本人・友達・管理者だけが読み書きできるようにする

### セキュリティの仕組み（v7 以降）

- **ログイン**: パスワードはサーバー側の関数（`arcade_login` / `arcade_register`）でだけ扱い、bcrypt で保存する。旧方式（ソルトなし SHA-256）のユーザーは、次回ログイン時に自動で bcrypt に置き換わる。10回失敗すると15分ロック。
- **セッション**: ログイン時に推測不能なトークンを発行し、`sbauth.js` が Supabase 宛てのリクエストに `x-arcade-session` ヘッダーとして付ける。各テーブルの RLS がこのトークンから利用者を判定する。**Supabase を使うページは、他のスクリプトより先に `sbauth.js` を読み込むこと。**
- **見える範囲**: users は本人と管理者のみ（パスワードハッシュは誰も読めない）。他人の表示は `profiles` ビュー経由で、氏名は本人・友達・自分に申請してきた相手にだけ見える。チャットは当事者・メンバーのみ、学習記録は本人のみ。レビューとスコアは公開。オンライン対戦のルームはゲストでも遊べるよう公開のまま。
- **管理者**: `users.is_admin = true` のアカウントでログインした時だけ管理画面が開く（旧来の共通パスワードは廃止）。別のアカウントを管理者にするには SQL Editor で `update users set is_admin = true where username = 'ユーザーID';`
- **残る制約**: 登録時のメール確認コードは EmailJS でブラウザから送る方式のため、厳密な本人確認にはなっていない（サーバー側でメールを送る仕組みが必要）。

`supabase_migrate_v2.sql` を実行しないと、各ゲームの `track.js` によるプレイ時間記録が保存されず、管理者画面の「利用回数」「利用時間」が空のままになります。

`supabase_migrate_v4.sql` を実行しないと、各ゲームの**オンライン対戦が機能しません**（ルーム作成・参加時に「rooms テーブルが未作成」エラーになります）。ログインは動くがオンライン対戦だけできない場合、まずこの SQL を実行してください。

`supabase_migrate_v5.sql` は**消しバト(keshibato)のオンライン対戦に必須**です。消しバトは元々 WebRTC(P2P) を使っていましたが、TURN サーバが無いと多くの回線で接続できないため、他ゲームと同じ Supabase 中継方式（`rooms` + `room_messages`）へ変更しました。消しバトのオンラインには **v4 と v5 の両方**が必要です。

`supabase_migrate_v6.sql` を実行しないと、ENGLISH の学習データの**クラウド同期が機能しません**（テーブル未作成のため同期リクエストが失敗し、各端末ローカル保存のみになります）。実行後はログイン中のユーザの学習状況が `english_progress` に保存され、端末・ブラウザをまたいで引き継げます。

## ENGLISH / STUDY（移転済み）

個人用の学習ツールは、ソースを非公開にし、ARCADE と保存領域（オリジン）を分けるため、
非公開リポジトリ `Koma-Shu/personal-tools` に移し、Cloudflare で配信しています。
ログインは HTML Viewer と同じ個人用 Supabase アカウント。旧URL（`ARCADES/ENGLISH/*`、`ARCADES/STUDY/study.html`、
ルートの `english.html` 等）は新しいURLへ転送します。ARCADE の Supabase に残っている
`english_progress` / `study_progress` は、移転先の取り込みページでコピーした後は使われません。

## Network — パケットの旅

`Network/packet-journey/index.html` は、**ネットワーク通信（パケットの旅）を解説する教育用サイト**です。
CSS/JS を含めてすべて単一 HTML に収める方針で、外部ファイルには分割しません（運用ルールは
`Network/packet-journey/CLAUDE.md` を参照）。ポータルの **NETWORK** カードから開けます。

> このディレクトリは、独立していた `Koma-Shu/packet-journey` リポジトリ（旧公開URL:
> `https://koma-shu.github.io/packet-journey/`）をこのリポジトリへ移設したものです。
> 現在の公開URLは **https://koma-shu.github.io/claude/Network/packet-journey/** です。
