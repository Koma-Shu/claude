"""試合音声のラウドネスを解析し、歓声・打球音のピーク位置を検出する。

線形補間だけだと打席位置は数十秒ずれうる。実際の映像では良いプレーの直後に
歓声が上がるので、その立ち上がりに寄せることで精度を上げる。

16kHz モノラルに落として読むので、1本20分でも数十MB程度しか使わない。
"""
from __future__ import annotations

import subprocess

import numpy as np

from . import util

SR = 16000
WIN_SEC = 0.25   # 解析窓
SMOOTH_SEC = 1.5  # 平滑化幅


def load_audio(path, sr: int = SR) -> np.ndarray:
    """ffmpeg でモノラル PCM に変換して読み込む。"""
    cmd = [util.ffmpeg(), "-hide_banner", "-loglevel", "error", "-nostdin",
           "-i", str(path), "-vn", "-ac", "1", "-ar", str(sr),
           "-f", "s16le", "-acodec", "pcm_s16le", "-"]
    proc = subprocess.run(cmd, capture_output=True)
    if proc.returncode != 0:
        tail = proc.stderr.decode("utf-8", "replace").strip().splitlines()[-10:]
        raise SystemExit(f"音声の抽出に失敗: {path}\n" + "\n".join(tail))
    return np.frombuffer(proc.stdout, dtype="<i2").astype(np.float32) / 32768.0


def envelope(samples: np.ndarray, sr: int = SR) -> tuple[np.ndarray, float]:
    """窓ごとの RMS を dB で返す。(値の配列, 1フレームの秒数)"""
    hop = max(1, int(sr * WIN_SEC))
    n = len(samples) // hop
    if n == 0:
        return np.zeros(0, dtype=np.float32), WIN_SEC
    frames = samples[:n * hop].reshape(n, hop)
    rms = np.sqrt((frames.astype(np.float64) ** 2).mean(axis=1))
    db = 20.0 * np.log10(np.maximum(rms, 1e-6))
    return db.astype(np.float32), hop / sr


def _smooth(x: np.ndarray, width: int) -> np.ndarray:
    """移動平均。端はゼロ詰めではなく端値で延長する。

    dB は負値なのでゼロ詰めすると端の音量が持ち上がり、区間の先頭と末尾に
    存在しないピークが立ってしまう。
    """
    if width <= 1 or len(x) < width:
        return x
    pad = width // 2
    padded = np.pad(x.astype(np.float64), pad, mode="edge")
    kernel = np.ones(width, dtype=np.float64) / width
    return np.convolve(padded, kernel, mode="valid")[:len(x)].astype(np.float32)


def find_peaks(db: np.ndarray, frame_sec: float, *,
               min_gap_sec: float = 4.0, z_threshold: float = 2.0) -> list[dict]:
    """平滑化した音量が周囲より突出している箇所を、立ち上がり時刻つきで返す。"""
    if len(db) == 0:
        return []
    smooth = _smooth(db, max(1, int(SMOOTH_SEC / frame_sec)))
    med = float(np.median(smooth))
    mad = float(np.median(np.abs(smooth - med))) or 1e-3
    z = (smooth - med) / (1.4826 * mad)

    min_gap = max(1, int(min_gap_sec / frame_sec))
    order = np.argsort(z)[::-1]
    chosen: list[int] = []
    for idx in order:
        if z[idx] < z_threshold:
            break
        if all(abs(idx - c) >= min_gap for c in chosen):
            chosen.append(int(idx))

    peaks = []
    for idx in sorted(chosen):
        # ピーク強度の一定割合まで下がった手前の位置を「立ち上がり」とみなす。
        # 絶対値 0 を基準にすると平坦な区間で際限なく遡ってしまう。
        floor = max(0.5, z[idx] * 0.35)
        limit = int(6.0 / frame_sec)
        onset = idx
        while onset > 0 and z[onset] > floor and idx - onset < limit:
            onset -= 1
        peaks.append({
            "t": round(idx * frame_sec, 3),
            "onset": round(onset * frame_sec, 3),
            "z": round(float(z[idx]), 3),
            "db": round(float(smooth[idx]), 2),
        })
    return peaks


def main(args) -> int:
    util.ensure_dirs()
    game = util.load("game")
    media = util.load("media")

    result = {}
    for s in sorted(game["segments"], key=lambda s: (s["half"], s["order"])):
        f = s["file"]
        path = util.MEDIA / f
        if not path.exists():
            print(f"  スキップ（未取得）: {f}")
            continue
        if not media.get(f, {}).get("has_audio", True):
            print(f"  スキップ（音声なし）: {f}")
            result[f] = []
            continue
        print(f"  解析中: {f} ...", end="", flush=True)
        db, frame_sec = envelope(load_audio(path))
        peaks = find_peaks(db, frame_sec, min_gap_sec=args.min_gap,
                           z_threshold=args.threshold)
        result[f] = peaks
        print(f" ピーク {len(peaks)} 箇所")

    util.save("peaks", result)
    print(f"\n保存しました: {util.WORK / 'peaks.json'}")
    return 0
