"""Google Drive から試合動画をダウンロードする。

rclone があればそれを使い、無ければ gdown にフォールバックする。
どちらも無い場合は手動ダウンロード用の一覧を表示して終わる（この工程だけは
ネットワークとブラウザ認証が絡むため、失敗しても後続工程を壊さない）。
"""
from __future__ import annotations

import shutil

from . import util


def _needed(game: dict) -> list[dict]:
    return sorted(game["segments"], key=lambda s: s["file"])


def plan_only(game: dict) -> None:
    total = sum(s["bytes"] for s in _needed(game))
    print(f"必要な動画 {len(_needed(game))} 本 / 合計 {total / 1e9:.2f} GB")
    print(f"保存先: {util.MEDIA}\n")
    for s in _needed(game):
        print(f"  {s['file']:<16} {s['bytes'] / 1e6:8.1f} MB  {s['half']}"
              f"{'(' + s['note'] + ')' if s.get('note') else ''}")
        print(f"      https://drive.google.com/file/d/{s['drive_id']}/view")
    for s in game.get("excluded", []):
        print(f"  {s['file']:<16} -- 除外: {s['reason']}")


def main(args) -> int:
    util.ensure_dirs()
    game = util.load("game")
    segments = _needed(game)

    todo = [s for s in segments if not (util.MEDIA / s["file"]).exists()]
    for s in segments:
        if s not in todo:
            print(f"  スキップ（取得済み）: {s['file']}")
    if not todo:
        print("すべての動画が取得済みです。")
        return 0

    if args.list:
        plan_only(game)
        return 0

    if args.rclone_remote and shutil.which("rclone"):
        for s in todo:
            src = f"{args.rclone_remote}:{args.rclone_path}/{s['file']}" if args.rclone_path \
                else f"{args.rclone_remote}:{s['file']}"
            print(f"  rclone copy {src}")
            util.run(["rclone", "copy", "--progress", src, str(util.MEDIA)])
        return 0

    try:
        import gdown  # noqa: F401
    except ImportError:
        print("rclone / gdown のどちらも使えません。手動でダウンロードしてください:\n")
        plan_only(game)
        print("\n（`pip install gdown` するか、`--rclone-remote <remote名>` を指定してください）")
        return 1

    import gdown
    for s in todo:
        dest = util.MEDIA / s["file"]
        print(f"  ダウンロード: {s['file']} ({s['bytes'] / 1e6:.0f} MB)")
        gdown.download(id=s["drive_id"], output=str(dest), quiet=False)
        if not dest.exists():
            print(f"    失敗: {s['file']} は手動で取得してください "
                  f"(https://drive.google.com/file/d/{s['drive_id']}/view)")
    return 0
