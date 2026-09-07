#!/usr/bin/env python3
"""音声からのアンカー推定を検証する。

体育館の暗騒音の上にプレー中の音（声・投球・打球）が乗り、前後の待機時間は
静かになる、という構造を合成音声で作って、推定した区間が正解に近いか見る。

    python3 tests/test_anchor_suggest.py
"""
from __future__ import annotations

import pathlib
import subprocess
import sys
import tempfile

import numpy as np

TOOL = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOL))
from capvid import util  # noqa: E402
from capvid.anchors import suggest_span  # noqa: E402

SR = 16000
TOLERANCE = 12.0        # 許容誤差(秒)。1打席ぶんの尺より十分小さければよい

# (名前, 全体尺, プレー開始, プレー終了)
CASES = [
    ("前後に長い待機があるとき", 300.0, 40.0, 250.0),
    ("待機が短いとき", 200.0, 8.0, 190.0),
    ("末尾に待機が無いとき", 180.0, 25.0, 180.0),
]


def synth(path: pathlib.Path, total: float, start: float, end: float) -> None:
    """暗騒音 + プレー区間の賑やかさ、で音声つき動画を作る。"""
    rng = np.random.default_rng(3)
    n = int(total * SR)
    x = rng.standard_normal(n).astype(np.float32) * 0.008        # 体育館の暗騒音
    a, b = int(start * SR), int(min(end, total) * SR)
    x[a:b] += rng.standard_normal(b - a).astype(np.float32) * 0.05  # 声や動きの音
    # プレー中は数十秒おきに投球・打球・歓声の山が立つ
    t = start + 6
    while t < end - 2:
        i = int(t * SR)
        w = int(1.6 * SR)
        x[i:i + w] += rng.standard_normal(min(w, n - i)).astype(np.float32) * 0.35
        t += rng.uniform(18, 40)

    raw = path.with_suffix(".raw")
    raw.write_bytes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    util.ff(["-f", "lavfi", "-i", f"color=c=gray:s=320x180:r=5:d={total}",
             "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", str(raw),
             "-c:v", "libx264", "-preset", "ultrafast", "-crf", "40",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "48k",
             "-shortest", str(path)])
    raw.unlink()


def main() -> int:
    failures = []
    with tempfile.TemporaryDirectory(prefix="capvid-anchor-") as tmp:
        tmp = pathlib.Path(tmp)
        for label, total, start, end in CASES:
            src = tmp / "seg.mp4"
            if src.exists():
                src.unlink()
            synth(src, total, start, end)
            span = suggest_span(src, sustain=6.0, k=0.35)
            if span is None:
                failures.append(f"{label}: 区間を判定できなかった")
                print(f"  [NG] {label}: 判定できず")
                continue
            got_start, got_end, determined = span
            if not determined:
                failures.append(f"{label}: 切り分けられなかった判定になっている")
            ds, de = abs(got_start - start), abs(got_end - min(end, total))
            ok = ds <= TOLERANCE and de <= TOLERANCE
            mark = "OK" if ok else "NG"
            print(f"  [{mark}] {label}\n"
                  f"         正解 {start:6.1f}-{min(end, total):6.1f}s / "
                  f"推定 {got_start:6.1f}-{got_end:6.1f}s "
                  f"(誤差 {ds:.1f}s, {de:.1f}s)")
            if not ok:
                failures.append(f"{label}: 誤差 {ds:.1f}s / {de:.1f}s")

    if failures:
        print("\n失敗:")
        print("\n".join("  " + f for f in failures))
        return 1
    print(f"\n検証OK: {len(CASES)} 件（許容誤差 {TOLERANCE:.0f}s）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
