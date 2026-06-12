# claude
repository for claude

## ARCADE

GitHub Pages で配信されるブラウザゲーム集（PWA対応）。

- ユーザ画面: `index.html`
- 管理者画面: `admin.html`（登録ユーザ・利用回数・利用時間・評価などを表示）

### Supabase セットアップ

新規構築時は `supabase_setup.sql` を Supabase SQL Editor で実行。

既存DBには差分のみ適用:

1. `supabase_migrate.sql` — フレンド / グループチャット関連
2. `supabase_migrate_v2.sql` — **play_sessions テーブル（利用回数・利用時間の記録に必須）**

`supabase_migrate_v2.sql` を実行しないと、各ゲームの `track.js` によるプレイ時間記録が保存されず、管理者画面の「利用回数」「利用時間」が空のままになります。
