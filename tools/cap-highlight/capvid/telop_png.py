"""テロップを Pillow で PNG に描き、ffmpeg の overlay で合成する。

ffmpeg の配布ビルドによっては freetype / libass を含まず、drawtext も ass も
使えないことがある（Homebrew 版でしばしば起きる）。その場合の代替経路。
文字の描画を全て Python 側で行うので、ffmpeg 側には overlay しか要求しない。
"""
from __future__ import annotations

import pathlib
import re
import unicodedata

from . import telop, util

# 日本語フォントを探すディレクトリ
FONT_DIRS = [
    "/System/Library/Fonts", "/System/Library/Fonts/Supplemental",
    "/Library/Fonts", "~/Library/Fonts",
    "/usr/share/fonts", "/usr/local/share/fonts",
    "~/.fonts", "~/.local/share/fonts",
]
# 日本語フォントの家族（優先度順）。ファイル名に含まれるかで判定する。
FONT_FAMILIES = [
    "ヒラギノ角ゴシック", "ヒラギノ角ゴ", "hiraginosans", "hiragino",
    "notosanscjk", "notosansjp", "noto sans jp", "notosans-jp",
    "sourcehansans", "yugoth", "ipaexg", "ipagp", "osaka", "meiryo",
    "notoserifcjk", "notoserifjp", "arialunicode",
]
# 中国語・韓国語向けの地域別派生。日本語の字形と違うので後回しにする
# （macOS の "Hiragino Sans GB" は簡体字用で、日本語の字形にならない）。
REGION_VARIANTS = re.compile(
    r"(\bgb\b|\bg1\b|cjk\s*[-_]?\s*(sc|tc|kr|hk)|\b(sc|tc|kr|hk)\b"
    r"|simplified|traditional|korean|chinese)", re.IGNORECASE)
# 太さの好み。テロップなので細すぎるものは避ける
WEIGHT_ORDER = ["w6", "w5", "demibold", "semibold", "bold", "w4", "medium",
                "w3", "regular", "w7", "w8", "normal"]
THIN = re.compile(r"(\bw[012]\b|thin|extralight|ultralight|\blight\b)",
                  re.IGNORECASE)
PROBE_TEXT = "辻蓋楡回表"        # 描けるか確かめる文字


def _font_files() -> list[pathlib.Path]:
    seen, out = set(), []
    for d in FONT_DIRS:
        base = pathlib.Path(d).expanduser()
        if not base.is_dir():
            continue
        for ext in ("*.ttc", "*.otf", "*.ttf", "*.otc"):
            for f in base.rglob(ext):
                if f not in seen:
                    seen.add(f)
                    out.append(f)
    return out


def _renders_japanese(path: pathlib.Path, index: int = 0) -> bool:
    """そのフォントで日本語が実際に描けるか（豆腐や空白でないか）を確かめる。"""
    from PIL import Image, ImageDraw, ImageFont
    try:
        font = ImageFont.truetype(str(path), 64, index=index)
    except (OSError, ValueError):
        return False
    img = Image.new("L", (400, 100), 0)
    ImageDraw.Draw(img).text((5, 5), PROBE_TEXT, font=font, fill=255)
    if not img.getbbox():
        return False
    # 全て同じ字形（豆腐）だと横幅が文字数で割り切れるだけでは判定できないので、
    # 1文字だけの描画と比べて幅が伸びているかも見る。
    one = Image.new("L", (400, 100), 0)
    ImageDraw.Draw(one).text((5, 5), PROBE_TEXT[0], font=font, fill=255)
    return bool(one.getbbox()) and img.getbbox()[2] > one.getbbox()[2]


def _norm(text: str) -> str:
    """比較用に正規化する。

    macOS のファイル名は NFD（濁点が分離した形）で保存されるため、
    「ヒラギノ」は キ+゙ になっていてソースコード中の NFC 表記と一致しない。
    これを踏まなかったせいで、日本語のヒラギノが素通りして簡体字用の
    "Hiragino Sans GB" が選ばれていた。
    """
    return unicodedata.normalize("NFKC", text).lower()


def score(path: pathlib.Path) -> tuple[int, int, int, str]:
    """フォントファイルの優先順位。小さいほど優先。

    (家族の順位, 地域別派生かどうか, 太さの順位, 名前) を返す。
    """
    low = _norm(path.name)
    family = len(FONT_FAMILIES)
    for i, name in enumerate(FONT_FAMILIES):
        if _norm(name) in low:
            family = i
            break
    region = 1 if REGION_VARIANTS.search(low) else 0
    if THIN.search(low):
        weight = len(WEIGHT_ORDER) + 1          # 細すぎるものは最後に
    else:
        weight = next((i for i, w in enumerate(WEIGHT_ORDER) if w in low),
                      len(WEIGHT_ORDER))
    # 同点時の並びも正規化した名前で決める（NFD/NFC で結果が変わらないように）
    return (family, region, weight, unicodedata.normalize("NFC", path.name))


def find_font(style: dict) -> tuple[pathlib.Path, int]:
    """使える日本語フォントのファイルと ttc のインデックスを返す。"""
    explicit = style["font"].get("file")
    if explicit:
        p = pathlib.Path(explicit).expanduser()
        if not p.exists():
            raise SystemExit(f"style.json の font.file が見つかりません: {p}")
        return p, int(style["font"].get("file_index", 0))

    files = _font_files()
    fontsdir = style["font"].get("fontsdir")
    if fontsdir:
        d = pathlib.Path(fontsdir).expanduser()
        files = [f for ext in ("*.ttc", "*.otf", "*.ttf") for f in d.rglob(ext)] + files

    for f in sorted(files, key=score):
        if score(f)[0] >= len(FONT_FAMILIES):
            break                      # 手掛かりのあるものを使い切った
        for index in (0, 1, 2):
            if _renders_japanese(f, index):
                return f, index
    # 手掛かりが無くても、片っ端から試す
    for f in files:
        if _renders_japanese(f, 0):
            return f, 0
    raise SystemExit(
        "日本語フォントが見つかりません。config/style.json の font.file に "
        ".ttf/.otf/.ttc のパスを直接指定してください。")


def render_png(text: str, spec: dict, scale: float, size: tuple[int, int],
               font_path, font_index: int, dest) -> None:
    """全画面サイズの透明 PNG に、指定位置へ文字を描く。"""
    from PIL import Image, ImageDraw, ImageFont

    w, h = size
    px = max(8, int(spec["size"] * scale))
    font = ImageFont.truetype(str(font_path), px, index=font_index)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    x, y = spec["x"] * scale, spec["y"] * scale
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    if spec["anchor"] == "bl":       # 左下基準
        pos = (x - bbox[0], y - th - bbox[1])
    elif spec["anchor"] == "tl":     # 左上基準
        pos = (x - bbox[0], y - bbox[1])
    else:                            # 中央基準
        pos = (x - tw / 2 - bbox[0], y - th / 2 - bbox[1])

    # 縁取り + 影で、明るい背景でも沈まないようにする
    stroke = max(2, int(3 * scale))
    draw.text((pos[0] + stroke, pos[1] + stroke), text, font=font,
              fill=(16, 16, 16, 150))
    draw.text(pos, text, font=font, fill=(255, 255, 255, 255),
              stroke_width=stroke, stroke_fill=(16, 16, 16, 210))
    img.save(dest)


def build_segment_overlays(seg_index: int, seg_start: float, elems: list[dict],
                           style: dict, out_size: tuple[int, int],
                           font_path, font_index: int, workdir) -> list[dict]:
    """あるセグメントに乗せるテロップを PNG 化し、合成に必要な情報を返す。"""
    lay = telop.layout(style)
    scale = out_size[1] / telop.DESIGN_H
    workdir = pathlib.Path(workdir)
    workdir.mkdir(parents=True, exist_ok=True)

    overlays = []
    for n, e in enumerate(el for el in elems if el["seg"] == seg_index):
        dest = workdir / f"{seg_index:03d}_{n}_{e['role']}.png"
        render_png(e["text"], lay[e["role"]], scale, out_size,
                   font_path, font_index, dest)
        overlays.append({
            "path": dest,
            "start": max(0.0, e["t0"] - seg_start),   # セグメント内の相対時刻
            "end": max(0.0, e["t1"] - seg_start),
            "fade_in": e["fade_in"], "fade_out": e["fade_out"],
        })
    return overlays


def filter_complex(overlays: list[dict], base_chain: str, fps: int) -> tuple[str, str]:
    """overlay を連ねた filter_complex と、最終的な映像ラベルを返す。"""
    parts = [f"[0:v]{base_chain}[base]"]
    label = "base"
    for i, ov in enumerate(overlays, start=1):
        dur = max(0.05, ov["end"] - ov["start"])
        fi = min(ov["fade_in"], dur / 2)
        fo = min(ov["fade_out"], dur / 2)
        parts.append(
            f"[{i}:v]format=rgba"
            f",fade=t=in:st=0:d={fi:.3f}:alpha=1"
            f",fade=t=out:st={dur - fo:.3f}:d={fo:.3f}:alpha=1"
            f",setpts=PTS+{ov['start']:.3f}/TB[tl{i}]")
        parts.append(
            f"[{label}][tl{i}]overlay=x=0:y=0:eof_action=pass:repeatlast=0"
            f":enable='between(t,{ov['start']:.3f},{ov['end']:.3f})'[ov{i}]")
        label = f"ov{i}"
    return ";".join(parts), label


def inputs_for(overlays: list[dict], fps: int) -> list[str]:
    args = []
    for ov in overlays:
        dur = max(0.05, ov["end"] - ov["start"])
        args += ["-loop", "1", "-framerate", str(fps), "-t", f"{dur:.3f}",
                 "-i", str(ov["path"])]
    return args
