"""カット位置の確認用に、各カットのコンタクトシートと低解像度プロキシを作る。

本番レンダリングは重いので、位置がずれていないかはここで潰す。
生成された PNG は Claude Code にそのまま読ませてズレを判定させられる。
"""
from __future__ import annotations

import pathlib

from . import util


def contact_sheet(src, t_in: float, t_out: float, dest, *, tiles: int = 6, width: int = 480):
    """区間を等間隔にサンプリングした1枚の横並び画像を作る。

    fps フィルタは各区間の中点を拾うため、区間の先頭と末尾が写らない。
    カット位置がずれていないかを見るための画像なので、時刻を指定して抜く。
    """
    from PIL import Image

    dur = max(0.1, t_out - t_in)
    times = [t_in + dur * i / (tiles - 1) for i in range(tiles)] if tiles > 1 else [t_in]
    tmp = pathlib.Path(dest).with_suffix("")
    frames = util.extract_frames(src, times, tmp, width=width, prefix="t")
    if not frames:
        raise SystemExit(f"フレームを抽出できません: {src}")

    with Image.open(frames[0]) as probe:
        h = probe.height
    canvas = Image.new("RGB", (width * len(frames), h))
    for i, f in enumerate(frames):
        with Image.open(f) as im:
            canvas.paste(im, (i * width, 0))
    canvas.save(dest)
    for f in frames:
        f.unlink()
    tmp.rmdir()


def proxy(src, t_in: float, t_out: float, dest, *, height: int = 360):
    util.ff(["-ss", f"{t_in:.3f}", "-t", f"{max(0.1, t_out - t_in):.3f}", "-i", str(src),
             "-vf", f"scale=-2:{height}", "-c:v", "libx264", "-preset", "veryfast",
             "-crf", "30", "-c:a", "aac", "-b:a", "96k", str(dest)])


def main(args) -> int:
    util.ensure_dirs()
    cuts = util.load("cuts")
    made = 0
    for it in cuts["items"]:
        if it["kind"] != "cut":
            continue
        if args.only and it["pa_id"] not in args.only:
            continue
        src = util.MEDIA / it["file"]
        if not src.exists():
            print(f"  スキップ（未取得）: {it['file']}")
            continue
        stem = f"{it['pa_id']}_{it['half']}_{it['batter']}"
        sheet = util.PREVIEW / f"{stem}.png"
        contact_sheet(src, it["src_in"], it["src_out"], sheet)
        print(f"  {sheet.name}  ({it['file']} {util.hhmmss(it['src_in'])}"
              f"→{util.hhmmss(it['src_out'])}, {it['method']})")
        if args.video:
            clip = util.PREVIEW / f"{stem}.mp4"
            proxy(src, it["src_in"], it["src_out"], clip)
        made += 1
    if not made:
        print("プレビュー対象がありません。")
        return 1
    print(f"\n{made} カットを {util.PREVIEW} に出力しました。")
    print("ズレていたカットは work/pa_anchors.csv に実測タイムコードを足して "
          "`anchors check` → `plan` をやり直してください。")
    return 0
