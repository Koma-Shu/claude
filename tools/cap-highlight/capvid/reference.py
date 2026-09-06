"""お手本ハイライト動画からフレームと音声特徴を抽出し、構成を分析できるようにする。

動画そのものを見る代わりに、等間隔フレーム・カット切り替わり・音量推移を出力して
テロップ書式や尺配分を読み取るための材料にする。
"""
from __future__ import annotations

import json
import shutil

from . import util


def download(url: str, dest) -> bool:
    if not shutil.which("yt-dlp"):
        print("yt-dlp が見つかりません。`pip install yt-dlp` を実行するか、")
        print(f"手動でダウンロードして {dest} に置いてください。")
        return False
    util.run(["yt-dlp", "-f", "bv*[height<=1080]+ba/b[height<=1080]",
              "--merge-output-format", "mp4", "-o", str(dest), url])
    return dest.exists()


def scene_changes(path, threshold: float = 0.30) -> list[float]:
    """シーン変化スコアからカットの切り替わり時刻を拾う。"""
    proc = util.run([util.ffmpeg(), "-hide_banner", "-nostdin", "-i", str(path),
                     "-vf", f"select='gt(scene,{threshold})',metadata=print:file=-",
                     "-an", "-f", "null", "-"], check=False)
    times = []
    for line in (proc.stdout or "").splitlines():
        if "pts_time:" in line:
            try:
                times.append(round(float(line.split("pts_time:")[1].split()[0]), 3))
            except (IndexError, ValueError):
                continue
    return times


def main(args) -> int:
    util.ensure_dirs()
    game = util.load("game")
    url = args.url or game.get("reference_video")
    dest = util.REFERENCE / "reference.mp4"

    if not dest.exists() and url and not download(url, dest):
        return 1
    if not dest.exists():
        print(f"{dest} がありません。")
        return 1

    from .probe import probe_file
    info = probe_file(dest)
    print(f"お手本動画: {util.hhmmss(info['duration'])} "
          f"{info['width']}x{info['height']} @{info['fps']:.2f}fps")

    frames_dir = util.REFERENCE / "frames"
    frames_dir.mkdir(exist_ok=True)
    every = args.every
    util.ff(["-i", str(dest), "-vf", f"fps=1/{every},scale=960:-2",
             str(frames_dir / "f_%04d.jpg")])
    n_frames = len(list(frames_dir.glob("f_*.jpg")))
    print(f"  {every}秒ごとのフレーム {n_frames} 枚 -> {frames_dir}")

    cuts = scene_changes(dest, args.scene_threshold)
    gaps = [round(b - a, 2) for a, b in zip(cuts, cuts[1:])]
    summary = {
        "duration": info["duration"], "fps": info["fps"],
        "resolution": [info["width"], info["height"]],
        "scene_cuts": cuts, "cut_count": len(cuts),
        "median_cut_sec": round(sorted(gaps)[len(gaps) // 2], 2) if gaps else None,
        "mean_cut_sec": round(sum(gaps) / len(gaps), 2) if gaps else None,
    }
    (util.REFERENCE / "reference.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  カット {len(cuts)} 箇所 / 1カット中央値 {summary['median_cut_sec']}s")
    print(f"  分析結果 -> {util.REFERENCE / 'reference.json'}")
    print(f"\nフレーム画像を Claude Code に読ませると、テロップの書式・位置・"
          f"配色を style.json に反映できます。")
    return 0
