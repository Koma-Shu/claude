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


_FILTER_CACHE: dict[str, bool] = {}


def has_filter(name: str) -> bool:
    """この ffmpeg ビルドに指定のフィルタが含まれているか。

    Homebrew などの配布ビルドは構成が一定ではなく、drawtext(freetype) や
    ass(libass) を欠くことがある。使う前に確かめられるようにしておく。
    """
    # 環境変数で「無いことにする」ための逃げ道。libass を欠くビルドを手元で
    # 再現したり、代替経路を試したりするのに使う。
    disabled = {n.strip() for n in os.environ.get("CAPVID_DISABLE_FILTERS", "").split(",")
                if n.strip()}
    if name in disabled:
        return False
    if name in _FILTER_CACHE:
        return _FILTER_CACHE[name]
    proc = run([ffmpeg(), "-hide_banner", "-filters"], check=False)
    listing = (proc.stdout or "") + (proc.stderr or "")
    found = set()
    for line in listing.splitlines():
        parts = line.split()
        # 例: " T.. drawtext           V->V       Draw text on top of video frames."
        if len(parts) >= 2 and len(parts[0]) <= 4:
            found.add(parts[1])
    for key in found:
        _FILTER_CACHE[key] = True
    _FILTER_CACHE.setdefault(name, name in found)
    return _FILTER_CACHE[name]


def installed_font_families() -> set[str] | None:
    """fc-list で取得できるフォントファミリ名。取得できなければ None。"""
    if not shutil.which("fc-list"):
        return None
    proc = subprocess.run(["fc-list", ":", "family"], capture_output=True,
                          text=True, errors="replace")
    families = set()
    for line in (proc.stdout or "").splitlines():
        # 1行に別名がカンマ区切りで並ぶ
        for name in line.split(","):
            name = name.strip()
            if name:
                families.add(name.lower())
    return families or None


def resolve_font(spec) -> tuple[str, bool]:
    """フォント名（文字列 or 候補リスト）から実在するものを選ぶ。

    日本語フォントの登録名は環境ごとに違う（macOS は 'Hiragino Sans'、
    Linux では 'Noto Sans CJK JP' など）。候補を順に見て最初に見つかったものを返す。
    戻り値は (フォント名, 実在を確認できたか)。
    """
    candidates = [spec] if isinstance(spec, str) else list(spec)
    if not candidates:
        raise SystemExit("style.json の font.name が空です")
    families = installed_font_families()
    if families is None:
        return candidates[0], False          # fc-list が無く判定不能
    for name in candidates:
        if name.lower() in families:
            return name, True
    return candidates[0], False


def extract_frames(src, times: list[float], dest_dir, *, width: int,
                   prefix: str = "f", quality: int = 4) -> list[pathlib.Path]:
    """指定した時刻ちょうどのフレームを1枚ずつ抜き出す。

    `fps=1/N` は各区間の「中点」を拾うため（15秒間隔なら 7.5, 22.5, ...）、
    抜いた画像の時刻がラベルと N/2 秒ずれる。アンカーの読み取りにも
    カット位置の確認にも使うので、時刻指定で1枚ずつ取り出して合わせる。
    """
    dest_dir = pathlib.Path(dest_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)
    out = []
    for i, t in enumerate(times):
        dest = dest_dir / f"{prefix}_{i:05d}.jpg"
        ff(["-ss", f"{max(0.0, t):.3f}", "-i", str(src),
            "-vf", f"scale={width}:-2", "-frames:v", "1",
            "-q:v", str(quality), str(dest)])
        if dest.exists():
            out.append(dest)
    return out


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
