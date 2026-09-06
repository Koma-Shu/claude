"""実行環境が揃っているかを確認する。

ffmpeg の配布ビルドは構成が一定でないため、必要なフィルタが欠けていることがある。
本番レンダリングの直前ではなく、最初にここで気づけるようにする。
"""
from __future__ import annotations

import shutil

from . import util

# (フィルタ名, 用途, 必須か)
FILTERS = [
    ("ass", "テロップの焼き込み（libass）", True),
    ("scale", "解像度の正規化", True),
    ("pad", "アスペクト比の調整", True),
    ("afade", "カット端の音声フェード", True),
    ("tile", "プレビューのコンタクトシート", True),
    ("amix", "BGM のミックス", False),
    ("sidechaincompress", "BGM の自動ダッキング", False),
    ("drawtext", "統合テストの合成動画（本体では未使用）", False),
]


def main(args) -> int:
    ok = True
    print("実行環境の確認\n")

    for tool in ("ffmpeg", "ffprobe"):
        path = shutil.which(tool)
        if path:
            print(f"  [OK]   {tool:10} {path}")
        elif tool == "ffmpeg":
            try:
                print(f"  [代替] {tool:10} {util.ffmpeg()}  (imageio-ffmpeg 同梱)")
            except SystemExit:
                print(f"  [NG]   {tool:10} 見つかりません")
                ok = False
        else:
            print(f"  [NG]   {tool:10} 見つかりません")
            print("         imageio-ffmpeg は ffprobe を含まないので別途必要です。")
            ok = False

    if not ok:
        print("\n  macOS:        brew install ffmpeg")
        print("  Ubuntu/Debian: sudo apt install ffmpeg")
        return 1

    print()
    missing_required = []
    for name, purpose, required in FILTERS:
        present = util.has_filter(name)
        mark = "OK" if present else ("NG" if required else "--")
        print(f"  [{mark}]   filter {name:18} {purpose}")
        if required and not present:
            missing_required.append(name)

    if missing_required:
        ok = False
        print(f"\n  必須フィルタが不足しています: {', '.join(missing_required)}")
        if "ass" in missing_required:
            print("  テロップの焼き込みには libass 付きの ffmpeg が要ります。")
            print("  macOS: brew reinstall ffmpeg   （それでも駄目なら brew install ffmpeg@7）")

    print()
    style = util.load("style")
    spec = style["font"]["name"]
    candidates = [spec] if isinstance(spec, str) else list(spec)
    name, found = util.resolve_font(spec)
    if found:
        print(f"  [OK]   フォント {name}")
    elif util.installed_font_families() is None:
        print(f"  [--]   フォント {name}（fc-list が無いため未確認）")
        print("         テロップが出ない場合はここを疑ってください。")
    else:
        print(f"  [NG]   日本語フォントが見つかりません")
        print(f"         探した候補: {', '.join(candidates)}")
        print("         config/style.json の font.name に実在するものを足してください。")
        ok = False

    print("\n" + ("すべて問題ありません。" if ok else "上記を解消してから再実行してください。"))
    return 0 if ok else 1
