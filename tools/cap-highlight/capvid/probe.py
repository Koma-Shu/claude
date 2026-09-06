"""元動画の長さ・解像度・fps を計測して work/media.json に保存する。"""
from __future__ import annotations

import json

from . import util


def probe_file(path) -> dict:
    proc = util.run([
        util.ffprobe(), "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", str(path)])
    data = json.loads(proc.stdout)
    video = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
    audio = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    if video is None:
        raise SystemExit(f"映像ストリームがありません: {path}")

    num, _, den = video.get("avg_frame_rate", "0/1").partition("/")
    fps = (float(num) / float(den)) if float(den or 0) else 0.0
    width, height = int(video["width"]), int(video["height"])
    # iPhone 縦位置撮影などの回転メタデータを反映した「見た目の」解像度
    rotation = 0
    for sd in video.get("side_data_list", []) or []:
        if "rotation" in sd:
            rotation = int(sd["rotation"]) % 360
    if rotation in (90, 270):
        width, height = height, width

    return {
        "duration": float(data["format"]["duration"]),
        "width": width, "height": height, "fps": round(fps, 4),
        "rotation": rotation,
        "has_audio": audio is not None,
        "audio_rate": int(audio["sample_rate"]) if audio else None,
        "size_bytes": int(data["format"]["size"]),
    }


def main(args) -> int:
    util.ensure_dirs()
    game = util.load("game")
    media, missing = {}, []
    for s in game["segments"]:
        path = util.MEDIA / s["file"]
        if not path.exists():
            missing.append(s["file"])
            continue
        info = probe_file(path)
        media[s["file"]] = info
        print(f"  {s['file']:<16} {util.hhmmss(info['duration'])}  "
              f"{info['width']}x{info['height']} @{info['fps']:.2f}fps"
              f"{'' if info['has_audio'] else '  [音声なし]'}")

    if missing:
        print(f"\n未取得: {', '.join(missing)}  → `fetch` を先に実行してください")
    if not media:
        return 1

    total = sum(v["duration"] for v in media.values())
    print(f"\n合計 {util.hhmmss(total)} ({len(media)} 本)")
    util.save("media", media)
    return 0 if not missing else 1
