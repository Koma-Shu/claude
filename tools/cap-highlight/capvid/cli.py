"""キャップ野球ハイライト生成ツールのコマンドライン入口。"""
from __future__ import annotations

import argparse
import sys


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        prog="cap-highlight",
        description="スコアブックと試合動画からハイライト動画を作る",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
標準的な流れ:
  0. doctor     ffmpeg・フィルタ・フォントが揃っているか確認
  1. fetch      Google Drive から試合動画を取得
  2. probe      動画の長さ・解像度・fps を計測
  3. scan       動画を時刻つきサムネイル一覧にする（記入の下調べ）
     anchors init / (anchors.csv を記入) / anchors check
  4. peaks      歓声・打球音のピークを検出
  5. plan       ハイライトを選定してカット割りを作る
  6. preview    カット位置をサムネイルで確認 → ズレたら pa_anchors.csv で補正
  7. render     テロップを焼き込んで書き出し
""")
    sub = ap.add_subparsers(dest="command", required=True)

    p = sub.add_parser("fetch", help="Google Drive から動画を取得する")
    p.add_argument("--list", action="store_true", help="取得せず一覧とURLを表示する")
    p.add_argument("--rclone-remote", help="rclone のリモート名（例: gdrive）")
    p.add_argument("--rclone-path", default="", help="リモート内のフォルダパス")

    sub.add_parser("probe", help="動画の長さ・解像度・fps を計測する")

    p = sub.add_parser("anchors", help="イニングと動画内タイムコードの対応づけ")
    p.add_argument("action", choices=["init", "check"])

    p = sub.add_parser("scan", help="動画全体を時刻つきサムネイル一覧にする")
    p.add_argument("--file", nargs="*", help="対象の動画（既定は全部）")
    p.add_argument("--interval", type=float, default=15.0, help="抽出間隔(秒)")
    p.add_argument("--cols", type=int, default=5)
    p.add_argument("--rows", type=int, default=4)
    p.add_argument("--width", type=int, default=480, help="1コマの幅(px)")

    p = sub.add_parser("peaks", help="歓声・打球音のピークを検出する")
    p.add_argument("--threshold", type=float, default=2.0, help="検出のZスコア閾値")
    p.add_argument("--min-gap", type=float, default=4.0, help="ピーク間の最小間隔(秒)")

    p = sub.add_parser("plan", help="ハイライトを選定してカット割りを作る")
    p.add_argument("--duration", type=float, help="目標尺(秒)。既定は style.json の値")
    p.add_argument("--include", nargs="*", metavar="PA_ID", help="必ず入れる打席ID")
    p.add_argument("--exclude", nargs="*", metavar="PA_ID", help="除外する打席ID")

    p = sub.add_parser("preview", help="カット位置を確認する画像を作る")
    p.add_argument("--only", nargs="*", metavar="PA_ID", help="対象を絞る")
    p.add_argument("--video", action="store_true", help="低解像度の動画も出す")

    sub.add_parser("telop", help="ASS テロップだけを再生成する")

    p = sub.add_parser("render", help="最終的な動画を書き出す")
    p.add_argument("-o", "--output", help="出力ファイル名（既定 highlight.mp4）")
    p.add_argument("--force", action="store_true", help="中間ファイルを作り直す")
    p.add_argument("--rebuild-telop", action="store_true", help="テロップを作り直す")

    p = sub.add_parser("reference", help="お手本動画を分析して構成を読み取る")
    p.add_argument("--url", help="既定は game.json の reference_video")
    p.add_argument("--every", type=float, default=3.0, help="フレーム抽出の間隔(秒)")
    p.add_argument("--scene-threshold", type=float, default=0.30)

    sub.add_parser("plays", help="打席データを検証して表示する")
    p = sub.add_parser("doctor", help="ffmpeg・フィルタ・フォントが揃っているか確認する")
    p.add_argument("--fonts", action="store_true",
                   help="見つかった日本語フォントの候補も一覧表示する")
    return ap


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    cmd = args.command

    if cmd == "fetch":
        from . import fetch
        return fetch.main(args)
    if cmd == "probe":
        from . import probe
        return probe.main(args)
    if cmd == "anchors":
        from . import anchors
        return anchors.main(args)
    if cmd == "scan":
        from . import scan
        return scan.main(args)
    if cmd == "peaks":
        from . import peaks
        return peaks.main(args)
    if cmd == "plan":
        from . import plan
        return plan.main(args)
    if cmd == "preview":
        from . import preview
        return preview.main(args)
    if cmd == "telop":
        from . import telop
        return telop.main(args)
    if cmd == "render":
        from . import render
        return render.main(args)
    if cmd == "reference":
        from . import reference
        return reference.main(args)
    if cmd == "doctor":
        from . import doctor
        return doctor.main(args)
    if cmd == "plays":
        from . import util
        data = util.load("plays")["plays"]
        for p in data:
            extras = f" [{' '.join(p['extras'])}]" if p["extras"] else ""
            flags = f"  ★{'/'.join(p['flags'])}" if p["flags"] else ""
            print(f"  {p['pa_id']:<6}{p['half']:<6}{p['batter']:<10}"
                  f"{p['result']:<5}{'打点' + str(p['rbi']) if p['rbi'] else '':<6}"
                  f"{extras}{flags}")
        print(f"\n{len(data)} 打席")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
