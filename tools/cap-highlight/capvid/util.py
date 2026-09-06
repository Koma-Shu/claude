"""パス解決・設定読み込み・ffmpeg の起動まわり。"""
from __future__ import annotations

import json
import os
import pathlib
import shutil
import subprocess
import sys

# CAPVID_ROOT を指定すると config/work/out をそこに置く。
# 1つのコードで複数の試合を扱いたいときに、試合ごとのディレクトリを指す。
ROOT = pathlib.Path(os.environ.get("CAPVID_ROOT")
                    or pathlib.Path(__file__).resolve().parent.parent).resolve()
CONFIG = ROOT / "config"
WORK = ROOT / "work"
MEDIA = WORK / "media"        # Drive から落とした元動画
SEGMENTS = WORK / "segments"  # 切り出した中間ファイル
PREVIEW = WORK / "preview"    # 確認用サムネイル
REFERENCE = WORK / "reference"
OUT = ROOT / "out"


def ensure_dirs() -> None:
    for d in (WORK, MEDIA, SEGMENTS, PREVIEW, REFERENCE, OUT):
        d.mkdir(parents=True, exist_ok=True)


def load(name: str) -> dict:
    """config/ 配下の JSON を読む。work/ 配下も名前で引ける。"""
    for base in (CONFIG, WORK):
        p = base / (name if name.endswith(".json") else f"{name}.json")
        if p.exists():
            return json.loads(p.read_text(encoding="utf-8"))
    raise FileNotFoundError(
        f"{name}.json が見つかりません。先行するコマンドを実行してください "
        f"(探した場所: {CONFIG}, {WORK})")


def save(name: str, data: dict) -> pathlib.Path:
    ensure_dirs()
    p = WORK / (name if name.endswith(".json") else f"{name}.json")
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return p


def _resolve(tool: str) -> str:
    """PATH の ffmpeg/ffprobe を優先し、なければ imageio-ffmpeg の同梱バイナリを使う。"""
    found = shutil.which(tool)
    if found:
        return found
    try:
        import imageio_ffmpeg
    except ImportError:
        raise SystemExit(
            f"{tool} が見つかりません。ffmpeg をインストールするか "
            f"`pip install imageio-ffmpeg` を実行してください。")
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    if tool == "ffmpeg":
        return exe
    # imageio-ffmpeg は ffprobe を同梱しないので、同じディレクトリにあれば拾う
    sibling = pathlib.Path(exe).with_name("ffprobe")
    if sibling.exists():
        return str(sibling)
    raise SystemExit(
        "ffprobe が見つかりません。ffmpeg 一式をインストールしてください "
        "(macOS: brew install ffmpeg / Ubuntu: apt install ffmpeg)。")


def ffmpeg() -> str:
    return _resolve("ffmpeg")


def ffprobe() -> str:
    return _resolve("ffprobe")


def has_ffprobe() -> bool:
    try:
        _resolve("ffprobe")
        return True
    except SystemExit:
        return False


def run(cmd: list[str], *, quiet: bool = True, check: bool = True) -> subprocess.CompletedProcess:
    """ffmpeg などを起動する。失敗時は末尾のログを添えて落とす。"""
    proc = subprocess.run(
        cmd, capture_output=True, text=True, errors="replace")
    if check and proc.returncode != 0:
        tail = "\n".join((proc.stderr or "").strip().splitlines()[-25:])
        raise SystemExit(
            f"コマンドが失敗しました (exit {proc.returncode}):\n"
            f"  {' '.join(cmd[:6])} ...\n{tail}")
    if not quiet and proc.stderr:
        print(proc.stderr, file=sys.stderr)
    return proc


def ff(args: list[str], *, overwrite: bool = True) -> subprocess.CompletedProcess:
    """ffmpeg をログ抑制つきで起動する。"""
    cmd = [ffmpeg(), "-hide_banner", "-loglevel", "error", "-nostdin"]
    if overwrite:
        cmd.append("-y")
    return run(cmd + args)


def hhmmss(seconds: float) -> str:
    seconds = max(0.0, float(seconds))
    m, s = divmod(seconds, 60)
    h, m = divmod(int(m), 60)
    return f"{h:d}:{m:02d}:{s:06.3f}"


def parse_timecode(text: str) -> float:
    """'93', '1:33', '01:33.5', '0:01:33.5' を秒に変換する。"""
    text = str(text).strip()
    if not text:
        raise ValueError("空のタイムコード")
    parts = text.split(":")
    if len(parts) > 3:
        raise ValueError(f"タイムコードとして解釈できません: {text!r}")
    total = 0.0
    for part in parts:
        total = total * 60 + float(part)
    return total
