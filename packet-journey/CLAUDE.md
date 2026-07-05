# packet-journey — 運用ルール

## プロジェクト概要
- ネットワーク通信(パケットの旅)を解説する教育用の単一HTMLサイト。
- `index.html` がすべて。CSS/JS は同ファイル内にインラインで保持する(外部ファイルに分割しない)。
- 公開URL: https://koma-shu.github.io/packet-journey/ (GitHub Pages / main ブランチから自動ビルド)

## 更新手順(必ずこの順で)
1. `index.html` を編集する。
2. 検証を行う:
   - `<script>` 内の JS を抽出して `node --check` で構文エラーがないこと
   - `<div>` / `<section>` 等のタグ開閉バランスが取れていること
   - `id` の重複がないこと
3. 問題なければ `git add index.html` → 日本語でコミット → `git push origin main`。
4. push 後、数分で https://koma-shu.github.io/packet-journey/ に反映される。

## コミットメッセージ
- 日本語、Conventional Commits 形式: `feat:` / `fix:` / `docs:` など。

## 壊してはいけないもの(回帰確認必須)
- レイヤカラー体系(色 = OSI レイヤ。L2=黄土 / L3=緑 / L4=青 / L7=赤紫 / 制御系=紫)
- モバイル表示(viewport / レスポンシブ)
- 日本語フォント(Shippori Mincho B1 / IBM Plex Sans JP / IBM Plex Mono)の読み込み
