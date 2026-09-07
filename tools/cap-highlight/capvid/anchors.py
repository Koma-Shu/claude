"""イニングの開始/終了を動画内タイムコードに対応づける（同期の起点）。

スコアブックには「試合開始からの経過時間」が無いので、ここだけは人手が要る。
入力するのは半イニングあたり2点（最初の投球 / 最後のアウト）だけで、
イニング内の各打席は打席番号による線形補間 + 音声ピークへのスナップで推定する。

    anchors init    work/anchors.csv のテンプレートを生成
    anchors check   記入内容を検証して work/anchors.json に確定
"""
from __future__ import annotations

import csv

from . import util

HEADER = ["file", "half", "order", "pa_from", "pa_to", "start_tc", "end_tc", "note"]
CSV_PATH = lambda: util.WORK / "anchors.csv"          # noqa: E731
PA_CSV_PATH = lambda: util.WORK / "pa_anchors.csv"    # noqa: E731

HALF_JA = {"top": "表", "bot": "裏"}


def half_label(half: str) -> str:
    return f"{half[0]}回{HALF_JA[half[1:]]}"


def cmd_init(game: dict) -> int:
    path = CSV_PATH()
    if path.exists():
        print(f"既に存在します（上書きしません）: {path}")
        return 0
    util.ensure_dirs()
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(HEADER)
        for s in sorted(game["segments"], key=lambda s: (s["half"], s["order"])):
            w.writerow([s["file"], s["half"], s["order"],
                        s["pa_range"][0], s["pa_range"][1], "", "", s.get("note", "")])

    pa_path = PA_CSV_PATH()
    if not pa_path.exists():
        with pa_path.open("w", encoding="utf-8", newline="") as fh:
            w = csv.writer(fh)
            w.writerow(["pa_id", "file", "tc", "note"])

    print(f"テンプレートを作成しました: {path}\n")
    print("各行の start_tc / end_tc に、その半イニングの")
    print("  start_tc = 先頭打者への最初の投球")
    print("  end_tc   = そのセグメント最後の打席が終わった瞬間")
    print("の動画内タイムコードを入れてください（例 1:23 / 0:01:23.5 / 83.5 いずれも可）。")
    print(f"\n打席単位でずれる場合は {pa_path.name} に pa_id と実測タイムコードを足すと、")
    print("その打席は補間ではなく実測値が使われます（例: T-03,IMG_5378.MOV,4:12）。")
    return 0


def _read_rows() -> list[dict]:
    path = CSV_PATH()
    if not path.exists():
        raise SystemExit(f"{path} がありません。先に `anchors init` を実行してください。")
    with path.open(encoding="utf-8-sig", newline="") as fh:
        return [r for r in csv.DictReader(fh) if (r.get("file") or "").strip()]


def read_pa_overrides() -> dict[str, dict]:
    path = PA_CSV_PATH()
    if not path.exists():
        return {}
    out = {}
    with path.open(encoding="utf-8-sig", newline="") as fh:
        for r in csv.DictReader(fh):
            pa_id = (r.get("pa_id") or "").strip()
            tc = (r.get("tc") or "").strip()
            if not pa_id or not tc:
                continue
            out[pa_id] = {"file": (r.get("file") or "").strip(),
                          "t": util.parse_timecode(tc)}
    return out


def cmd_check(game: dict) -> int:
    rows = _read_rows()
    try:
        media = util.load("media")
    except FileNotFoundError:
        media = {}
        print("注意: work/media.json がありません。動画長との突き合わせは省略します"
              "（`probe` を先に実行すると検証が効きます）。\n")

    known = {(s["file"]) : s for s in game["segments"]}
    anchors, errs, blank = {}, [], []

    for r in rows:
        f = r["file"].strip()
        if f not in known:
            errs.append(f"  {f}: game.json の segments に無いファイルです")
            continue
        if not r["start_tc"].strip() or not r["end_tc"].strip():
            blank.append(f)
            continue
        try:
            start = util.parse_timecode(r["start_tc"])
            end = util.parse_timecode(r["end_tc"])
        except ValueError as e:
            errs.append(f"  {f}: {e}")
            continue
        if end <= start:
            errs.append(f"  {f}: end_tc ({end:.1f}s) が start_tc ({start:.1f}s) 以下です")
            continue
        dur = media.get(f, {}).get("duration")
        if dur and end > dur + 0.5:
            errs.append(f"  {f}: end_tc {end:.1f}s が動画長 {dur:.1f}s を超えています")
            continue
        anchors[f] = {"half": known[f]["half"], "order": known[f]["order"],
                      "pa_from": known[f]["pa_range"][0], "pa_to": known[f]["pa_range"][1],
                      "start": start, "end": end}
        span = end - start
        n_pa = known[f]["pa_range"][1] - known[f]["pa_range"][0] + 1
        print(f"  {f:<16} {half_label(known[f]['half']):<6} "
              f"{util.hhmmss(start)} → {util.hhmmss(end)}  "
              f"({span:6.1f}s / {n_pa}打席 = {span / n_pa:5.1f}s per 打席)")

    if blank:
        print(f"\n未記入: {', '.join(blank)}")
    if errs:
        print("\nエラー:")
        print("\n".join(errs))
        return 1
    if blank:
        print(f"{CSV_PATH()} を記入してから再実行してください。")
        return 1

    overrides = read_pa_overrides()
    if overrides:
        print(f"\n打席単位の実測値 {len(overrides)} 件を検出: {', '.join(sorted(overrides))}")
    util.save("anchors", {"segments": anchors, "pa_overrides": overrides})
    print(f"\n確定しました: {util.WORK / 'anchors.json'}")
    return 0


def suggest_span(path, *, sustain: float, k: float,
                 gap: float = 25.0) -> tuple[float, float] | None:
    """音声から「プレーしている区間」の始まりと終わりを推定する。

    体育館の暗騒音の上に、投球・打球・声・歓声が乗る。前後の待機時間は
    それらが無いので静かになる。

    中央値からの外れ具合では判定できない。プレーが尺の大半を占めると
    中央値そのものがプレー中の音量になってしまうため。静かな床と賑やかな
    本編の2つの水準があるとみなし、その間に閾値を置く。
    投球と投球の間の短い静寂で区間が切れないよう、隙間は埋める。
    """
    import numpy as np

    from .peaks import _smooth, envelope, load_audio

    db, frame_sec = envelope(load_audio(path))
    if len(db) == 0:
        return None
    smooth = _smooth(db, max(1, int(2.0 / frame_sec)))

    floor = float(np.percentile(smooth, 10))    # 待機中の暗騒音
    top = float(np.percentile(smooth, 90))      # プレー中の賑やかさ
    if top - floor < 1.5:                       # 差が無い＝全編通して同じ
        return 0.0, len(smooth) * frame_sec
    active = smooth > floor + k * (top - floor)

    # 隙間を埋める（投球の合間の静寂でぶつ切りにしない）
    gap_frames = max(1, int(gap / frame_sec))
    idx = np.flatnonzero(active)
    if idx.size == 0:
        return None
    for a, b in zip(idx, idx[1:]):
        if b - a <= gap_frames:
            active[a:b] = True

    need = max(1, int(sustain / frame_sec))
    spans, run_start = [], None
    for i, a in enumerate(active):
        if a and run_start is None:
            run_start = i
        elif not a and run_start is not None:
            if i - run_start >= need:
                spans.append((run_start, i))
            run_start = None
    if run_start is not None and len(active) - run_start >= need:
        spans.append((run_start, len(active)))
    if not spans:
        return None
    return spans[0][0] * frame_sec, spans[-1][1] * frame_sec


def cmd_suggest(game: dict, args) -> int:
    """音声から推定した値で anchors.csv を埋める。"""
    media = util.load("media")
    path = CSV_PATH()
    rows, notes = [], []

    for s in sorted(game["segments"], key=lambda s: (s["half"], s["order"])):
        src = util.MEDIA / s["file"]
        n_pa = s["pa_range"][1] - s["pa_range"][0] + 1
        if not src.exists():
            notes.append(f"  {s['file']}: 未取得のため空欄")
            rows.append([s["file"], s["half"], s["order"], s["pa_range"][0],
                         s["pa_range"][1], "", "", s.get("note", "")])
            continue

        print(f"  解析中: {s['file']} ...", end="", flush=True)
        span = suggest_span(src, sustain=args.sustain, k=args.threshold)
        dur = media.get(s["file"], {}).get("duration")
        if span is None:
            print(" 判定できず")
            rows.append([s["file"], s["half"], s["order"], s["pa_range"][0],
                         s["pa_range"][1], "", "", s.get("note", "")])
            continue

        start, end = span
        start = max(0.0, start - args.margin)
        if dur:
            end = min(dur, end + args.margin)
        rows.append([s["file"], s["half"], s["order"], s["pa_range"][0],
                     s["pa_range"][1], f"{start:.1f}", f"{end:.1f}",
                     s.get("note", "")])
        per = (end - start) / n_pa
        print(f" {util.hhmmss(start)} → {util.hhmmss(end)}"
              f"  ({end - start:6.1f}s / {n_pa}打席 = {per:5.1f}s per 打席)")

    if path.exists() and not args.force:
        raise SystemExit(f"{path} が既にあります。上書きするなら --force を付けてください。")
    util.ensure_dirs()
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(HEADER)
        w.writerows(rows)
    if not PA_CSV_PATH().exists():
        with PA_CSV_PATH().open("w", encoding="utf-8", newline="") as fh:
            csv.writer(fh).writerow(["pa_id", "file", "tc", "note"])

    print("\n".join(notes))
    print(f"\n推定値を書き込みました: {path}")
    print("これは音量からの推定なので、必ず確認してください。1打席あたりの秒数が")
    print("極端な行は疑わしいです。直したら `anchors check` を実行してください。")
    return 0


def main(args) -> int:
    game = util.load("game")
    if args.action == "init":
        return cmd_init(game)
    if args.action == "suggest":
        return cmd_suggest(game, args)
    return cmd_check(game)
