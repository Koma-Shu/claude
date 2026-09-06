#!/usr/bin/env python3
"""合成動画で全工程を通す統合テスト。

実素材（4GB超）が手元に無くてもパイプラインの健全性を確認できる。
テスト用の半イニング動画を ffmpeg で作り、決め打ちの位置に「歓声」を混ぜたうえで、
probe → anchors → peaks → plan → preview → render を通しで実行する。

    python3 tests/e2e_synthetic.py [--keep]
"""
from __future__ import annotations

import argparse
import csv
import json
import pathlib
import random
import shutil
import subprocess
import sys
import tempfile

TOOL = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOL))

from capvid import util  # noqa: E402

# ファイル -> (尺, 歓声を置く打席のインデックス)
SPEC = {
    "IMG_5378.MOV": (150, [2, 8]),     # 1回表 11打席: 辻の先制二塁打, 小松川の二塁打
    "IMG_5379.MOV": (45, [0, 1, 2]),   # 1回裏  3打席: 三者連続三振
    "IMG_5380.MOV": (140, [3, 7, 8]),  # 2回表 10打席
    "IMG_5381.MOV": (70, [0]),         # 2回裏前半 5打席
    "IMG_5383.MOV": (110, [0]),        # 2回裏後半 6打席
    "IMG_5384.MOV": (70, []),          # 3回表  5打席
    "IMG_5385.MOV": (75, [4]),         # 3回裏  5打席: ゲームセット
}
LEAD, TAIL = 5.0, 4.0   # 実素材同様、前後に余白がある想定


def make_media(root: pathlib.Path, game: dict) -> list[list]:
    media = root / "work" / "media"
    media.mkdir(parents=True, exist_ok=True)
    rng = random.Random(11)
    rows = []
    # drawtext は freetype 付きの ffmpeg にしか無い（Homebrew の配布ビルドでは
    # 欠けていることがある）。合成動画にタイムコードを焼くための飾りなので、
    # 無ければ省略してテスト自体は続行する。
    stamp = util.has_filter("drawtext")
    if not stamp:
        print("  注意: この ffmpeg には drawtext が無いため、"
              "合成動画のタイムコード表示は省略します（テストには影響しません）。")
    for seg in game["segments"]:
        f = seg["file"]
        dur, hot = SPEC[f]
        n = seg["pa_range"][1] - seg["pa_range"][0] + 1
        start, end = LEAD, dur - TAIL
        span = end - start
        # 歓声は打席の中心から少しずらす（実素材のズレを模擬）
        bursts = [start + (k + 0.5) * span / n + rng.uniform(-2.5, 2.5) for k in hot]
        # lavfi の引数中ではカンマがフィルタ区切りになるのでエスケープする
        expr = "0.02*random(0)"
        for b in bursts:
            expr += f"+0.55*random(0)*between(t\\,{b:.2f}\\,{b + 2.2:.2f})"
        cmd = [
            util.ffmpeg(), "-hide_banner", "-loglevel", "error", "-y",
            "-f", "lavfi", "-i", f"testsrc2=s=640x360:r=15:d={dur}",
            "-f", "lavfi", "-i", f"aevalsrc={expr}:s=44100:d={dur}",
        ]
        if stamp:
            cmd += ["-vf", f"drawtext=text='{f} %{{pts\\:hms}}':fontsize=26"
                           f":fontcolor=white:x=20:y=20:box=1:boxcolor=black@0.6"]
        cmd += ["-c:v", "libx264", "-preset", "ultrafast", "-crf", "32",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k",
                "-shortest", str(media / f)]
        subprocess.run(cmd, check=True)
        rows.append([f, seg["half"], seg["order"], seg["pa_range"][0], seg["pa_range"][1],
                     f"{start:.2f}", f"{end:.2f}", seg.get("note", "")])
        print(f"  合成: {f} {dur}s (歓声 {len(bursts)} 箇所)")
    return rows


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--keep", action="store_true", help="作業ディレクトリを残す")
    args = ap.parse_args()

    # ffmpeg / ffprobe が揃っているかを最初に確かめる。後段で落ちるより分かりやすい。
    missing = [n for n in ("ass", "scale", "pad", "afade", "tile")
               if util.has_ffprobe() and not util.has_filter(n)]
    if missing:
        print(f"この ffmpeg には必須フィルタがありません: {', '.join(missing)}")
        print("`python3 run.py doctor` で詳細を確認してください。")
        return 1

    if not util.has_ffprobe():
        print("ffprobe が見つかりません。ffmpeg 一式をインストールしてください:")
        print("  macOS: brew install ffmpeg")
        print("  Ubuntu/Debian: sudo apt install ffmpeg")
        print("（pip の imageio-ffmpeg は ffmpeg 本体のみで ffprobe を含みません）")
        return 1

    root = pathlib.Path(tempfile.mkdtemp(prefix="capvid-e2e-"))
    print(f"作業ディレクトリ: {root}\n")
    try:
        (root / "config").mkdir(parents=True)
        for f in ("game.json", "plays.json", "style.json"):
            shutil.copy(TOOL / "config" / f, root / "config" / f)

        # テストなので小さく速く。テロップ座標は 1920x1080 基準のままで比率は保たれる。
        style = json.loads((root / "config/style.json").read_text(encoding="utf-8"))
        style["output"].update(width=640, height=360, fps=15,
                               video_bitrate="800k", target_duration_sec=75)
        style["timing"].update(intro_sec=3.0, outro_sec=2.5, half_card_sec=1.0,
                               cut_min_sec=5.0, cut_max_sec=12.0,
                               pre_roll_sec=4.0, post_roll_sec=3.0)
        (root / "config/style.json").write_text(
            json.dumps(style, ensure_ascii=False, indent=2), encoding="utf-8")

        game = json.loads((root / "config/game.json").read_text(encoding="utf-8"))
        rows = make_media(root, game)

        env = dict(__import__("os").environ, CAPVID_ROOT=str(root))

        def step(*a):
            print(f"\n$ run.py {' '.join(a)}")
            r = subprocess.run([sys.executable, str(TOOL / "run.py"), *a],
                               env=env, capture_output=True, text=True)
            print((r.stdout or r.stderr).rstrip())
            if r.returncode:
                raise SystemExit(f"失敗: {' '.join(a)}\n{r.stderr[-1500:]}")

        step("probe")
        step("anchors", "init")
        with (root / "work/anchors.csv").open("w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh)
            w.writerow(["file", "half", "order", "pa_from", "pa_to",
                        "start_tc", "end_tc", "note"])
            w.writerows(rows)
        step("anchors", "check")
        step("peaks")
        step("plan")
        step("preview")
        step("render")

        cuts = json.loads((root / "work/cuts.json").read_text(encoding="utf-8"))
        checks = []

        # 同じ位置を2つの打席が指していないこと
        seen = {}
        for it in cuts["items"]:
            if it["kind"] != "cut":
                continue
            key = (it["file"], round(it["contact"], 1))
            if key in seen:
                checks.append(f"重複: {it['pa_id']} と {seen[key]} が同じ位置を指しています")
            seen[key] = it["pa_id"]

        # 各動画内で打席順と時刻順が一致していること
        by_file = {}
        for it in cuts["items"]:
            if it["kind"] == "cut":
                by_file.setdefault(it["file"], []).append(it)
        for f, its in by_file.items():
            ts = [i["contact"] for i in its]
            if ts != sorted(ts):
                checks.append(f"{f}: 打席順と時刻順が逆転しています")

        out = root / "out/highlight.mp4"
        if not out.exists():
            checks.append("出力ファイルがありません")
        else:
            got = cuts["total_duration"]
            if abs(got - cuts["target_duration"]) > 2.0:
                checks.append(f"尺 {got:.1f}s が目標 {cuts['target_duration']}s から離れています")

        if checks:
            print("\n検証に失敗しました:")
            print("\n".join("  " + c for c in checks))
            return 1
        print(f"\n検証OK  カット {len(seen)} 本 / 尺 {cuts['total_duration']:.1f}s")
        print(f"出力: {out}")
        return 0
    finally:
        if args.keep:
            print(f"\n（--keep のため残しました: {root}）")
        else:
            shutil.rmtree(root, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
