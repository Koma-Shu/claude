"""カット位置の確認用に、各カットのコンタクトシートと低解像度プロキシを作る。

本番レンダリングは重いので、位置がずれていないかはここで潰す。
生成された PNG は Claude Code にそのまま読ませてズレを判定させられる。
"""
from __future__ import annotations

from . import util


def contact_sheet(src, t_in: float, t_out: float, dest, *, tiles: int = 6, width: int = 480):
    """区間を等間隔にサンプリングした1枚の横並び画像を作る。"""
    dur = max(0.1, t_out - t_in)
    fps = tiles / dur
    util.ff(["-ss", f"{t_in:.3f}", "-t", f"{dur:.3f}", "-i", str(src),
             "-vf", f"fps={fps:.6f},scale={width}:-2,tile={tiles}x1",
             "-frames:v", "1", str(dest)])


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
