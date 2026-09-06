#!/usr/bin/env python3
"""日本語フォントの選び方を固定するテスト。

macOS の "Hiragino Sans GB" は簡体字中国語用で、日本語の字形にならない。
ファイル名の "hiragino" に素直に一致させると、日本語のヒラギノ
（ファイル名が "ヒラギノ角ゴシック W6.ttc"）より先に選ばれてしまう。
実機がないと気づけない類の間違いなので、並び順をここで固定しておく。

    python3 tests/test_font_ranking.py
"""
from __future__ import annotations

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
from capvid.telop_png import score  # noqa: E402

# 実在するファイル名（macOS / Linux）
MACOS = ["Hiragino Sans GB.ttc", "ヒラギノ角ゴシック W0.ttc",
         "ヒラギノ角ゴシック W3.ttc", "ヒラギノ角ゴシック W6.ttc",
         "ヒラギノ明朝 ProN.ttc", "Osaka.ttf", "Helvetica.ttc",
         "Arial Unicode.ttf"]
LINUX = ["NotoSansCJK-Regular.ttc", "NotoSansCJKsc-Bold.otf",
         "NotoSansJP-Bold.otf", "DejaVuSans.ttf", "ipaexg.ttf"]

CASES = [
    ("macOS では日本語のヒラギノを選ぶ（GB版ではない）",
     MACOS, "ヒラギノ角ゴシック W6.ttc"),
    ("GB版しか無ければそれを使う",
     [n for n in MACOS if "ヒラギノ角ゴシック" not in n], "Hiragino Sans GB.ttc"),
    ("Linux では地域別派生でない Noto CJK を選ぶ",
     LINUX, "NotoSansCJK-Regular.ttc"),
    ("細いウェイトは選ばない",
     ["ヒラギノ角ゴシック W0.ttc", "ヒラギノ角ゴシック W3.ttc"],
     "ヒラギノ角ゴシック W3.ttc"),
    ("日本語フォントが無ければ手掛かり無しとして最下位に落ちる",
     ["Helvetica.ttc", "DejaVuSans.ttf"], "DejaVuSans.ttf"),
]


def main() -> int:
    failures = []
    for label, names, expected in CASES:
        got = min(names, key=lambda n: score(pathlib.Path(n)))
        mark = "OK" if got == expected else "NG"
        print(f"  [{mark}] {label}\n         -> {got}")
        if got != expected:
            failures.append(f"{label}: {got} を選んだが {expected} のはず")

    # 地域別派生は、同じ家族の日本語版より必ず後ろ
    jp = score(pathlib.Path("NotoSansCJK-Regular.ttc"))
    sc = score(pathlib.Path("NotoSansCJKsc-Regular.otf"))
    if not jp < sc:
        failures.append("地域別派生(sc)が日本語版より優先されている")

    if failures:
        print("\n失敗:")
        print("\n".join("  " + f for f in failures))
        return 1
    print(f"\n検証OK: {len(CASES)} 件")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
