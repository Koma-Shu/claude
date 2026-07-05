# packet-journey ステージング(一時置き場)

このフォルダは **`Koma-Shu/packet-journey` リポジトリへ反映するためのステージング** です。
本来の置き場所ではありません。

## 経緯
- このセッションの GitHub App 連携には `packet-journey` リポジトリへの **書き込み権限がない** ため、
  直接 push できませんでした(読み取りは可能)。
- 更新内容を失わないよう、このブランチに一時保存しています。

## 反映方法
`packet-journey` リポジトリへの書き込み権限を付与した後、このフォルダの内容を
`packet-journey` リポジトリのルートにコピーして main に push すると、
https://koma-shu.github.io/packet-journey/ が更新されます。

- `index.html` → リポジトリ直下へ(最新版・2026-07-05 時点)
- `CLAUDE.md` → リポジトリ直下へ(Claude Code 用の運用ルール)
- `.claude/settings.json` → リポジトリ直下の `.claude/` へ(権限設定)

反映が完了したら、このフォルダ(`packet-journey/`)は `claude` リポジトリから削除して構いません。
