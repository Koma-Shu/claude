"""cuts.json と telop.ass から最終的なハイライト動画を書き出す。

1. 各アイテムを共通仕様（解像度・fps・音声48kHzステレオ）の中間ファイルに正規化する
2. concat demuxer で連結する
3. テロップを焼き込み、BGM があればミックスする

正規化を挟むのは、iPhone 撮影の元動画が本数ごとに解像度・fps・回転を変えうるため。
そのまま concat すると音ズレや破綻が起きる。
"""
from __future__ import annotations

import shlex

from . import util


def _vf_normalise(w: int, h: int, fps: int) -> str:
    return (f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:color=black,"
            f"setsar=1,fps={fps},format=yuv420p")


def _enc(style: dict, extra: list[str] | None = None) -> list[str]:
    out = style["output"]
    return ([
        "-c:v", "libx264", "-preset", "medium", "-b:v", out["video_bitrate"],
        "-pix_fmt", "yuv420p", "-r", str(out["fps"]),
        "-c:a", "aac", "-b:a", out["audio_bitrate"], "-ar", "48000", "-ac", "2",
    ] + (extra or []))


def build_cut(it: dict, style: dict, dest) -> None:
    out, timing = style["output"], style["timing"]
    src = util.MEDIA / it["file"]
    dur = it["duration"]
    fade = min(float(timing.get("audio_fade_sec", 0.25)), dur / 4)
    gain = style["audio"].get("game_audio_gain_db", 0.0)
    af = (f"aresample=48000,volume={gain}dB,"
          f"afade=t=in:st=0:d={fade:.3f},afade=t=out:st={dur - fade:.3f}:d={fade:.3f}")
    util.ff([
        "-ss", f"{it['src_in']:.3f}", "-t", f"{dur:.3f}", "-i", str(src),
        "-vf", _vf_normalise(out["width"], out["height"], out["fps"]),
        "-af", af, *_enc(style), str(dest)])


def build_card(it: dict, style: dict, dest) -> None:
    """イントロ・イニングカード・アウトロ用の無地クリップ（文字は ASS で乗せる）。"""
    out = style["output"]
    dur = it["duration"]
    util.ff([
        "-f", "lavfi", "-i",
        f"color=c=black:s={out['width']}x{out['height']}:r={out['fps']}:d={dur:.3f}",
        "-f", "lavfi", "-i", f"anullsrc=r=48000:cl=stereo:d={dur:.3f}",
        "-shortest", *_enc(style), str(dest)])


def concat(paths, dest, style) -> None:
    listing = util.SEGMENTS / "concat.txt"
    listing.write_text(
        "".join(f"file {shlex.quote(str(p))}\n" for p in paths), encoding="utf-8")
    util.ff(["-f", "concat", "-safe", "0", "-i", str(listing),
             "-c", "copy", str(dest)])


def finish(joined, dest, style, ass_path, total: float) -> None:
    """テロップ焼き込み + BGM ミックス。"""
    audio = style["audio"]
    font_dir = style["font"].get("fontsdir")
    ass_filter = f"ass='{ass_path}'" + (f":fontsdir='{font_dir}'" if font_dir else "")

    args = ["-i", str(joined)]
    bgm = audio.get("bgm_path")
    if bgm:
        args += ["-stream_loop", "-1", "-i", str(bgm)]
        fi, fo = audio["bgm_fade_in_sec"], audio["bgm_fade_out_sec"]
        chain = (f"[1:a]aresample=48000,volume={audio['bgm_gain_db']}dB,"
                 f"afade=t=in:st=0:d={fi},afade=t=out:st={max(0.0, total - fo):.3f}:d={fo},"
                 f"atrim=0:{total:.3f}[bgm];")
        if audio.get("duck_bgm", True):
            chain += ("[bgm][0:a]sidechaincompress=threshold=0.05:ratio=8:"
                      "attack=20:release=600[duck];[0:a][duck]amix=inputs=2:"
                      "duration=first:dropout_transition=0[aout]")
        else:
            chain += "[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=0[aout]"
        args += ["-filter_complex", f"[0:v]{ass_filter}[vout];{chain}",
                 "-map", "[vout]", "-map", "[aout]"]
    else:
        args += ["-vf", ass_filter, "-map", "0:v", "-map", "0:a"]

    args += _enc(style) + ["-movflags", "+faststart", str(dest)]
    util.ff(args)


def main(args) -> int:
    util.ensure_dirs()
    cuts = util.load("cuts")
    style = util.load("style")

    ass_path = util.WORK / "telop.ass"
    if not ass_path.exists() or args.rebuild_telop:
        from .telop import build
        ass_path.write_text(build(cuts, style), encoding="utf-8")
        print(f"  テロップを生成: {ass_path}")

    paths = []
    for i, it in enumerate(cuts["items"]):
        label = it.get("pa_id") or it["kind"]
        dest = util.SEGMENTS / f"{i:03d}_{it['kind']}_{label}.mp4"
        paths.append(dest)
        if dest.exists() and not args.force:
            print(f"  再利用: {dest.name}")
            continue
        print(f"  生成中: {dest.name} ({it['duration']:.1f}s)")
        if it["kind"] == "cut":
            src = util.MEDIA / it["file"]
            if not src.exists():
                raise SystemExit(f"元動画がありません: {src}  → `fetch` を実行してください")
            build_cut(it, style, dest)
        else:
            build_card(it, style, dest)

    joined = util.WORK / "joined.mp4"
    print("  連結中 ...")
    concat(paths, joined, style)

    dest = util.OUT / (args.output or "highlight.mp4")
    print("  テロップ焼き込み + 仕上げ ...")
    finish(joined, dest, style, ass_path, cuts["total_duration"])

    from .probe import probe_file
    info = probe_file(dest)
    print(f"\n完成: {dest}")
    print(f"  {util.hhmmss(info['duration'])}  {info['width']}x{info['height']} "
          f"@{info['fps']:.2f}fps  {info['size_bytes'] / 1e6:.1f} MB")
    return 0
