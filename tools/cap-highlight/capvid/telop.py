"""cuts.json から ASS 字幕を生成する（テロップ・スコアバグ・イントロ/アウトロ）。

drawtext を連結するより ASS のほうが、フェード・日本語の禁則・位置指定を
まとめて扱えて、焼き込みも1パスで済む。
"""
from __future__ import annotations

from . import util


def ass_time(seconds: float) -> str:
    seconds = max(0.0, float(seconds))
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:d}:{m:02d}:{s:05.2f}"


def _colour(value: str) -> str:
    """style.json の '&H00FFFFFF&' を ASS スタイル行の書式に正規化する。"""
    return str(value).rstrip("&")


def _escape(text: str) -> str:
    return (str(text).replace("\\", "\\\\").replace("{", "\\{")
            .replace("}", "\\}").replace("\n", "\\N"))


# テロップの座標・サイズはこの基準解像度で表現する。libass が実際の出力解像度へ
# 等倍スケールするので、出力を 720p や 4K に変えても style.json を書き換えずに済む。
DESIGN_W, DESIGN_H = 1920, 1080


def build(cuts: dict, style: dict) -> str:
    out = style["output"]
    font = style["font"]
    tel = style["telop"]
    col = style["colors"]
    lt, sb, hc = tel["lower_third"], tel["scorebug"], tel["half_card"]

    text_c, shadow_c = _colour(col["text"]), _colour(col["shadow"])
    name, bold_name = font["name"], font.get("bold_name") or font["name"]

    def style_line(sname, fname, size, align, ml, mr, mv, bold=1, outline=3, shadow=2):
        return (f"Style: {sname},{fname},{size},{text_c},{text_c},{shadow_c},{shadow_c},"
                f"{bold},0,0,0,100,100,0,0,1,{outline},{shadow},{align},{ml},{mr},{mv},1")

    head = [
        "[Script Info]",
        "ScriptType: v4.00+",
        f"PlayResX: {DESIGN_W}",
        f"PlayResY: {DESIGN_H}",
        "WrapStyle: 0",
        "ScaledBorderAndShadow: yes",
        "YCbCr Matrix: TV.709",
        "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour,"
        " BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle,"
        " BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        # 下三分の一（打者名 / 結果）
        style_line("Title", bold_name, lt["title_size"], 1,
                   lt["margin_left"], 60, lt["margin_bottom"] + lt["subtitle_size"] + 18),
        style_line("Detail", name, lt["subtitle_size"], 1,
                   lt["margin_left"], 60, lt["margin_bottom"], bold=0, outline=2),
        # 左上のスコアバグ
        style_line("Scorebug", name, sb["size"], 7,
                   sb["margin_left"], 60, sb["margin_top"], bold=0, outline=2),
        # 中央（イントロ・イニングカード・アウトロ）
        style_line("CardTitle", bold_name, hc["title_size"], 5, 120, 120, 0, outline=4),
        style_line("CardDetail", name, hc["subtitle_size"], 5, 120, 120, 0, bold=0, outline=3),
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]

    events: list[str] = []

    def fit(text: str, base: int, budget: int = 13) -> str:
        """長いタイトルが画面幅を越えないよう、文字数に応じて縮める。"""
        n = max(1, len(str(text)))
        if n <= budget:
            return ""
        return f"{{\\fs{max(int(base * budget / n), int(base * 0.45))}}}"

    def add(start, end, sname, text, *, fade=None, shift_y=0, prefix=""):
        if end <= start:
            return
        tags = prefix
        if fade:
            tags += f"{{\\fad({fade[0]},{fade[1]})}}"
        if shift_y:
            tags += f"{{\\move(0,{shift_y},0,0)}}"
        events.append(f"Dialogue: 0,{ass_time(start)},{ass_time(end)},{sname},,0,0,0,,"
                      f"{tags}{_escape(text)}")

    fade = (lt["fade_in_ms"], lt["fade_out_ms"])
    card_fade = (300, 300)
    cx = DESIGN_W // 2
    card_title_y = int(DESIGN_H * 0.44)
    card_detail_y = int(DESIGN_H * 0.63)

    for it in cuts["items"]:
        t0 = it["timeline_start"]
        t1 = t0 + it["duration"]
        kind = it["kind"]

        if kind in ("intro", "outro"):
            add(t0 + 0.2, t1 - 0.2, "CardTitle", it["title"], fade=card_fade,
                prefix=f"{{\\an5\\pos({cx},{card_title_y})}}"
                       + fit(it["title"], hc["title_size"]))
            if it.get("detail"):
                add(t0 + 0.5, t1 - 0.2, "CardDetail", it["detail"], fade=card_fade,
                    prefix=f"{{\\an5\\pos({cx},{card_detail_y})}}")
            continue

        if kind == "half_card":
            add(t0, t1, "CardTitle", it["title"], fade=card_fade,
                prefix=f"{{\\an5\\pos({cx},{card_title_y})}}"
                       + fit(it["title"], hc["title_size"]))
            if it.get("detail"):
                add(t0, t1, "CardDetail", it["detail"], fade=card_fade,
                    prefix=f"{{\\an5\\pos({cx},{card_detail_y})}}")
            continue

        # カット本体: 冒頭に下三分の一、区間全体にスコアバグ
        hold = min(float(lt["hold_sec"]), max(1.5, it["duration"] - 1.0))
        add(t0 + 0.35, t0 + 0.35 + hold, "Title", it["title"], fade=fade,
            prefix=fit(it["title"], lt["title_size"], budget=18))
        if it.get("detail"):
            add(t0 + 0.45, t0 + 0.45 + hold, "Detail", it["detail"], fade=fade)
        if sb.get("enabled", True) and it.get("scorebug"):
            add(t0 + 0.2, t1 - 0.2, "Scorebug", it["scorebug"], fade=(200, 250))

    return "\n".join(head + events) + "\n"


def main(args) -> int:
    util.ensure_dirs()
    cuts = util.load("cuts")
    style = util.load("style")
    path = util.WORK / "telop.ass"
    path.write_text(build(cuts, style), encoding="utf-8")
    n = sum(1 for line in path.read_text(encoding="utf-8").splitlines()
            if line.startswith("Dialogue:"))
    print(f"テロップ {n} 件を書き出しました: {path}")
    return 0
