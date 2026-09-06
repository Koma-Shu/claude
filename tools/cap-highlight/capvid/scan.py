"""動画全体を時刻つきのサムネイル一覧にする。

anchors.csv に入れる「その半イニングの最初の投球」「最後の打席が終わった瞬間」を
動画を早送りしながら探すのは手間なので、一覧を見て当たりを付けられるようにする。
出力した画像はそのまま Claude Code に読ませて時刻を読み取らせることもできる。
"""
from __future__ import annotations

import pathlib

from . import util


def _label_font(size: int):
    from PIL import ImageFont
    from .telop_png import find_font
    try:
        path, index = find_font(util.load("style"))
        return ImageFont.truetype(str(path), size, index=index)
    except (SystemExit, OSError):
        return ImageFont.load_default()


def sheet(src: pathlib.Path, duration: float, dest_dir: pathlib.Path, *,
          interval: float, cols: int, rows: int, tile_w: int) -> list[pathlib.Path]:
    from PIL import Image, ImageDraw

    frames_dir = dest_dir / f"_{src.stem}"
    frames_dir.mkdir(parents=True, exist_ok=True)
    for old in frames_dir.glob("*.jpg"):
        old.unlink()

    times = []
    t = 0.0
    while t < duration:
        times.append(t)
        t += interval
    frames = util.extract_frames(src, times, frames_dir, width=tile_w)
    if not frames:
        return []

    per_sheet = cols * rows
    label_h = max(22, tile_w // 14)
    out = []
    with Image.open(frames[0]) as probe:
        tile_h = probe.height
    font = _label_font(int(label_h * 0.8))

    for page in range((len(frames) + per_sheet - 1) // per_sheet):
        chunk = frames[page * per_sheet:(page + 1) * per_sheet]
        n_rows = (len(chunk) + cols - 1) // cols
        canvas = Image.new("RGB", (cols * tile_w, n_rows * (tile_h + label_h)),
                           (18, 18, 18))
        draw = ImageDraw.Draw(canvas)
        for k, f in enumerate(chunk):
            idx = page * per_sheet + k
            t = times[idx]
            x, y = (k % cols) * tile_w, (k // cols) * (tile_h + label_h)
            with Image.open(f) as im:
                canvas.paste(im, (x, y))
            draw.rectangle([x, y + tile_h, x + tile_w, y + tile_h + label_h],
                           fill=(18, 18, 18))
            draw.text((x + 6, y + tile_h + 2), util.hhmmss(t)[:-4],
                      font=font, fill=(255, 235, 120))
        dest = dest_dir / f"{src.stem}_{page + 1:02d}.png"
        canvas.save(dest)
        out.append(dest)

    for f in frames:
        f.unlink()
    frames_dir.rmdir()
    return out


def main(args) -> int:
    util.ensure_dirs()
    game = util.load("game")
    media = util.load("media")
    dest_dir = util.WORK / "scan"
    dest_dir.mkdir(parents=True, exist_ok=True)

    segments = game["segments"]
    if args.file:
        segments = [s for s in segments if s["file"] in args.file]
        if not segments:
            raise SystemExit(f"該当する動画がありません: {', '.join(args.file)}")

    made = []
    for s in sorted(segments, key=lambda s: (s["half"], s["order"])):
        src = util.MEDIA / s["file"]
        if not src.exists():
            print(f"  スキップ（未取得）: {s['file']}")
            continue
        dur = media.get(s["file"], {}).get("duration")
        if dur is None:
            raise SystemExit("work/media.json がありません。`probe` を先に実行してください。")
        pages = sheet(src, dur, dest_dir, interval=args.interval, cols=args.cols,
                      rows=args.rows, tile_w=args.width)
        n_pa = s["pa_range"][1] - s["pa_range"][0] + 1
        print(f"  {s['file']:<16} {s['half']} ({n_pa}打席, {util.hhmmss(dur)}) "
              f"-> {len(pages)}枚")
        made += pages

    if not made:
        return 1
    print(f"\n{len(made)} 枚を {dest_dir} に出力しました（{args.interval:.0f}秒間隔）。")
    print("画像を見て、各動画の「最初の投球」と「最後の打席が終わった瞬間」の")
    print("時刻を work/anchors.csv に入れてください。")
    print("画像をそのまま Claude Code に読ませて時刻を読み取らせることもできます。")
    return 0
