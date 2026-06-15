# claude
repository for claude

GitHub Pages で配信される PWA。入口（ポータル）で **ARCADE（ゲーム）** と
**STUDY（就活対策）** の2つに分かれています。

- 入口ポータル: `index.html`（ARCADE / STUDY を選ぶメニュー）
- ARCADE（ゲーム一覧）: `arcade.html`
- STUDY（就活対策）: `study.html`
- 管理者画面: `admin.html`（登録ユーザ・利用回数・利用時間・評価などを表示）

ARCADE と STUDY はユーザー視点で独立したアプリですが、ログインアカウント
（`users` テーブル / `arcade_user`）は共通です。

## ARCADE

`arcade.html` はブラウザゲーム集（リバーシ・将棋・麻雀・カードゲーム等）。各ゲームの
「← ARCADE」はこのゲーム一覧へ戻ります。

## STUDY — 就活対策トレーニング

`study.html` は、就職活動の適性検査・面接対策を行う学習アプリです。ポータル（`index.html`）
の「STUDY」、または直接 `study.html` から入れます。

- **対応分野**: SPI（言語・非言語）／玉手箱／TG-WEB／ケース面接／フェルミ推定
- **問題バンク**: `study-data.js`（多数の問題＋充実した解説。選択式・数値入力・自己採点式）
- **エビングハウスの忘却曲線に基づく間隔反復学習**: `srs.js` が **SM-2 アルゴリズム**で
  一問ごとに最適な復習日を計算。忘れかけたタイミングで自動的に出題し、最小の労力で
  記憶の定着を最大化します。ダッシュボードに忘却曲線の図解・定着度・学習ヒートマップを表示。
- **ログイン連携**: ARCADE と同じアカウント（`users` テーブル）でログインすると、学習進捗が
  Supabase に保存され、どの端末でも引き継がれます。未ログイン時は端末内（localStorage）に保存。

### 問題の追加方法

`study-data.js` の `window.STUDY_DATA` 配列に問題オブジェクトを追加するだけです
（スキーマはファイル冒頭のコメント参照）。`id` は一度公開したら変更しないこと
（間隔反復のキーになるため）。

### Supabase セットアップ

新規構築時は `supabase_setup.sql` を Supabase SQL Editor で実行。

既存DBには差分のみ適用:

1. `supabase_migrate.sql` — フレンド / グループチャット関連
2. `supabase_migrate_v2.sql` — **play_sessions テーブル（利用回数・利用時間の記録に必須）**
3. `supabase_migrate_v3.sql` — **study_progress テーブル（STUDY の学習進捗・復習スケジュールの保存に必須）**
4. `supabase_migrate_v4.sql` — **rooms テーブル（オンライン対戦に必須）**

`supabase_migrate_v2.sql` を実行しないと、各ゲームの `track.js` によるプレイ時間記録が保存されず、管理者画面の「利用回数」「利用時間」が空のままになります。

`supabase_migrate_v3.sql` を実行しないと、ログイン時の学習進捗が Supabase に保存されず、端末をまたいだ同期ができません（未ログイン同様、端末内保存のみになります）。

`supabase_migrate_v4.sql` を実行しないと、各ゲームの**オンライン対戦が機能しません**（ルーム作成・参加時に「rooms テーブルが未作成」エラーになります）。ログインは動くがオンライン対戦だけできない場合、まずこの SQL を実行してください。
