"""実行環境が揃っているかを確認する。

ffmpeg の配布ビルドは構成が一定でないため、必要なフィルタが欠けていることがある。
本番レンダリングの直前ではなく、最初にここで気づけるようにする。
"""
from __future__ import annotations

import shutil

from . import util

# (フィルタ名, 用途, 必須か)
FILTERS = [
    ("scale", "解像度の正規化", True),
    ("pad", "アスペクト比の調整", True),
    ("afade", "カット端の音声フェード", True),
    ("overlay", "テロップ画像の合成", True),
    ("tile", "プレビューのコンタクトシート", True),
    ("ass", "テロップの焼き込み（libass。無ければ画像化して合成）", False),
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

    print()
    style = util.load("style")

    # テロップの描画方法を決める
    if util.has_filter("ass"):
        print("  [OK]   テロップ: ass フィルタで焼き込み")
    else:
        try:
            import PIL  # noqa: F401
            print("  [OK]   テロップ: ass が無いため Pillow で画像化して合成")
        except ImportError:
            print("  [NG]   テロップを描く手段がありません")
            print("         この ffmpeg は libass を含まないので Pillow が要ります:")
            print("           pip3 install pillow")
            ok = False
    if util.has_filter("ass"):
        spec = style["font"]["name"]
        candidates = [spec] if isinstance(spec, str) else list(spec)
        name, found = util.resolve_font(spec)
        if found:
            print(f"  [OK]   フォント {name}")
        elif util.installed_font_families() is None:
            print(f"  [--]   フォント {name}（fc-list が無いため未確認）")
            print("         テロップが出ない場合はここを疑ってください。")
        else:
            print("  [NG]   日本語フォントが見つかりません")
            print(f"         探した候補: {', '.join(candidates)}")
            print("         config/style.json の font.name に実在するものを足してください。")
            ok = False
    else:
        # Pillow 経路はフォント「ファイル」を直接探すので、そちらで確認する
        try:
            from .telop_png import find_font
            path, index = find_font(style)
            print(f"  [OK]   フォント {path}"
                  + (f" (index {index})" if index else ""))
            print("         別のフォントを使いたい場合は "
                  "config/style.json の font.file にパスを指定してください。")
        except SystemExit as e:
            print(f"  [NG]   {e}")
            ok = False
        except ImportError:
            pass

    print("\n" + ("すべて問題ありません。" if ok else "上記を解消してから再実行してください。"))
    return 0 if ok else 1
