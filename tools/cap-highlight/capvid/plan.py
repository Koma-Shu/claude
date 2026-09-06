"""打席データ + アンカー + 音声ピークから、最終的なカット割り (work/cuts.json) を作る。

1. 各打席にハイライトスコアを付ける（結果・打点・文脈フラグ）
2. スコア順に、尺の予算が許すかぎり採用する（各半イニング最低1本は確保）
3. 採用分を時系列に並べ、余った尺をスコア比で配分する
4. 打席位置は「イニング内の打席番号による線形補間」→「音声ピークへのスナップ」で決める
"""
from __future__ import annotations

from . import util

HALF_ORDER = {"1top": 0, "1bot": 1, "2top": 2, "2bot": 3, "3top": 4, "3bot": 5}
HALF_JA = {"top": "表", "bot": "裏"}


def half_label(half: str) -> str:
    return f"{half[0]}回{HALF_JA[half[1:]]}"


def score_play(play: dict, sel: dict) -> float:
    s = float(sel["base"].get(play["result"], 0))
    s += play["rbi"] * sel["rbi_bonus"]
    for flag in play["flags"]:
        s += sel["flag_bonus"].get(flag, 0)
    return s


def describe(play: dict, game: dict) -> dict:
    """テロップ文言を組み立てる。"""
    team = game["teams"][play["team"]]["name"]
    title = f"{play['batter']}　{play['result_ja']}"
    bits = [half_label(play["half"]), team]
    if play["rbi"]:
        bits.append(f"{play['rbi']}打点")
    detail = " · ".join(bits)
    if "先制" in play["flags"]:
        detail += " — 先制"
    if "三者連続三振" in play["flags"]:
        detail += " — 三者連続三振"
    if "ゲームセット" in play["flags"]:
        detail += " — ゲームセット"
    return {"title": title, "detail": detail}


def score_entering(half: str, game: dict) -> tuple[int, int]:
    """その半イニングに入る時点のスコア（先攻, 後攻）。スコアバグ表示に使う。"""
    ls = game["linescore"]
    inning, side = int(half[0]), half[1:]
    away = sum(ls["away"][: inning - 1])
    home = sum(ls["home"][: inning - 1])
    if side == "bot":
        away += ls["away"][inning - 1]
    return away, home


def estimate_times(plays, game, anchors, peaks, media, style) -> dict[str, dict]:
    """打席ID -> {file, contact, method} を返す。"""
    seg_by_file = {s["file"]: s for s in game["segments"]}
    by_pa = {}
    for f, a in anchors["segments"].items():
        seg = seg_by_file[f]
        for p in plays:
            team = "away" if seg["half"].endswith("top") else "home"
            if p["team"] != team or p["half"] != seg["half"]:
                continue
            if not (a["pa_from"] <= p["pa_no"] <= a["pa_to"]):
                continue
            by_pa.setdefault(f, []).append(p)

    window = float(style["timing"].get("snap_window_sec", 12.0))
    out = {}
    overrides = anchors.get("pa_overrides", {})

    for f, ps in by_pa.items():
        a = anchors["segments"][f]
        ps.sort(key=lambda p: p["pa_no"])
        n = len(ps)
        span = a["end"] - a["start"]
        min_sep = max(3.0, span / n * 0.35)   # 隣り合う打席が同じ位置を指さないための最小間隔

        # 打席は時系列に並んでいるので、スナップも時刻が単調増加するように割り当てる。
        # 同じ歓声を2つの打席が奪い合うと、片方が大きくずれた位置を指してしまう。
        used_peaks: set[int] = set()
        last_t = a["start"] - min_sep
        for k, p in enumerate(ps):
            center = a["start"] + (k + 0.5) * span / n
            if p["pa_id"] in overrides:
                t = overrides[p["pa_id"]]["t"]
                out[p["pa_id"]] = {"file": overrides[p["pa_id"]].get("file") or f,
                                   "contact": t, "method": "実測"}
                last_t = max(last_t, t)
                continue

            # 探索幅は打席1つ分の間隔でも抑える。広すぎると隣の打席の歓声を掴む。
            eff = min(window, span / n * 0.6)
            lower = max(center - eff, last_t + min_sep)
            upper = center + eff
            # 候補が複数あるときは「補間位置に最も近い」ものを採る。
            # 歓声の大きさ(z)の差には打席を識別する意味がないので、順位付けに使うと
            # 隣の打席のピークを掴みうる。z は足切りにだけ使う。
            best_i, best_d = None, float("inf")
            for i, peak in enumerate(peaks.get(f, [])):
                if i in used_peaks or not (lower <= peak["onset"] <= upper):
                    continue
                d = abs(peak["onset"] - center)
                if d < best_d:
                    best_i, best_d = i, d

            if best_i is not None:
                peak = peaks[f][best_i]
                used_peaks.add(best_i)
                contact = peak["onset"]
                method = f"歓声スナップ(z={peak['z']:.1f}, {contact - center:+.1f}s)"
            else:
                contact = max(center, last_t + min_sep)
                method = "線形補間" if contact == center else "線形補間(間隔調整)"
            out[p["pa_id"]] = {"file": f, "contact": contact, "method": method}
            last_t = contact
    return out


def main(args) -> int:
    game = util.load("game")
    plays = util.load("plays")["plays"]
    style = util.load("style")
    anchors = util.load("anchors")
    media = util.load("media")
    try:
        peaks = util.load("peaks")
    except FileNotFoundError:
        peaks = {}
        print("注意: work/peaks.json がありません。線形補間のみで位置を推定します。\n")

    sel, timing = style["selection"], style["timing"]
    target = float(args.duration or style["output"]["target_duration_sec"])

    for p in plays:
        p["score"] = score_play(p, sel)

    times = estimate_times(plays, game, anchors, peaks, media, style)
    covered = [p for p in plays if p["pa_id"] in times]
    if not covered:
        raise SystemExit("アンカーに対応する打席がありません。anchors.csv を確認してください。")

    # --- 採用する打席を選ぶ -------------------------------------------------
    include = set(sel.get("manual_include") or []) | set(args.include or [])
    exclude = set(sel.get("manual_exclude") or []) | set(args.exclude or [])
    pool = [p for p in covered if p["pa_id"] not in exclude]

    halves = sorted({p["half"] for p in pool}, key=lambda h: HALF_ORDER[h])
    overhead = timing["intro_sec"] + timing["outro_sec"] + timing["half_card_sec"] * len(halves)
    budget = target - overhead
    if budget <= 0:
        raise SystemExit(f"目標尺 {target}s がイントロ等のオーバーヘッド {overhead:.1f}s を下回っています。")

    chosen: list[dict] = []
    used = set()

    def take(p):
        if p["pa_id"] in used:
            return False
        if (len(chosen) + 1) * timing["cut_min_sec"] > budget:
            return False
        chosen.append(p)
        used.add(p["pa_id"])
        return True

    for pa_id in include:                       # 明示指定を最優先
        p = next((q for q in pool if q["pa_id"] == pa_id), None)
        if p:
            take(p)
    for half in halves:                          # 各半イニング最低1本
        in_half = [p for p in pool if p["half"] == half and p["pa_id"] not in used]
        for p in sorted(in_half, key=lambda p: -p["score"])[: sel.get("min_per_half", 1)]:
            take(p)
    for p in sorted(pool, key=lambda p: -p["score"]):   # 残りをスコア順
        if not take(p):
            continue

    chosen.sort(key=lambda p: (HALF_ORDER[p["half"]], p["pa_no"]))

    # --- 尺を配分する -------------------------------------------------------
    lo, hi = timing["cut_min_sec"], timing["cut_max_sec"]
    total_score = sum(p["score"] for p in chosen) or 1.0
    lengths = {}
    for p in chosen:
        lengths[p["pa_id"]] = lo
    leftover = budget - lo * len(chosen)
    for p in sorted(chosen, key=lambda p: -p["score"]):
        if leftover <= 0:
            break
        add = min(hi - lo, leftover, budget * p["score"] / total_score)
        lengths[p["pa_id"]] += add
        leftover -= add

    # --- タイムラインを組む -------------------------------------------------
    items, t = [], 0.0
    items.append({"kind": "intro", "duration": timing["intro_sec"], "timeline_start": 0.0,
                  "title": game["title"],
                  "detail": f"{game['date']}  {game['teams']['away']['name']} "
                            f"{game['linescore']['away_total']} - "
                            f"{game['linescore']['home_total']} {game['teams']['home']['name']}"})
    t += timing["intro_sec"]

    last_half = None
    for p in chosen:
        if p["half"] != last_half:
            a, h = score_entering(p["half"], game)
            items.append({"kind": "half_card", "duration": timing["half_card_sec"],
                          "timeline_start": round(t, 3), "half": p["half"],
                          "title": half_label(p["half"]),
                          "detail": f"{game['teams']['away']['short']} {a} - "
                                    f"{h} {game['teams']['home']['short']}"})
            t += timing["half_card_sec"]
            last_half = p["half"]

        est = times[p["pa_id"]]
        dur = lengths[p["pa_id"]]
        # 接触点が前寄り/後ろ寄りにならないよう pre/post の比率を保って伸ばす
        ratio = timing["pre_roll_sec"] / (timing["pre_roll_sec"] + timing["post_roll_sec"])
        src_in = est["contact"] - dur * ratio
        info = media.get(est["file"], {})
        src_in = max(0.0, src_in)
        if info.get("duration"):
            src_in = min(src_in, max(0.0, info["duration"] - dur))
        away, home = score_entering(p["half"], game)
        text = describe(p, game)
        items.append({
            "kind": "cut", "pa_id": p["pa_id"], "half": p["half"],
            "batter": p["batter"], "result": p["result"], "rbi": p["rbi"],
            "flags": p["flags"], "score": round(p["score"], 1),
            "file": est["file"], "src_in": round(src_in, 3),
            "src_out": round(src_in + dur, 3),
            "contact": round(est["contact"], 3), "method": est["method"],
            "duration": round(dur, 3), "timeline_start": round(t, 3),
            "title": text["title"], "detail": text["detail"],
            "scorebug": f"{game['teams']['away']['short']} {away} - "
                        f"{home} {game['teams']['home']['short']}  {half_label(p['half'])}",
        })
        t += dur

    items.append({"kind": "outro", "duration": timing["outro_sec"],
                  "timeline_start": round(t, 3),
                  "title": f"{game['teams']['away']['name']} "
                           f"{game['linescore']['away_total']} - "
                           f"{game['linescore']['home_total']} "
                           f"{game['teams']['home']['name']}",
                  "detail": f"勝 {game['decision']['win']}　敗 {game['decision']['lose']}"})
    t += timing["outro_sec"]

    cuts = {"total_duration": round(t, 3), "target_duration": target,
            "items": items,
            "not_selected": [
                {"pa_id": p["pa_id"], "half": p["half"], "batter": p["batter"],
                 "result": p["result"], "score": round(p["score"], 1)}
                for p in sorted(pool, key=lambda p: -p["score"]) if p["pa_id"] not in used][:15]}
    util.save("cuts", cuts)

    # --- 表示 ---------------------------------------------------------------
    print(f"採用 {len(chosen)} カット / 合計 {util.hhmmss(t)} (目標 {util.hhmmss(target)})\n")
    for it in items:
        if it["kind"] != "cut":
            print(f"  [{util.hhmmss(it['timeline_start'])}] {it['kind']:<10} "
                  f"{it.get('title', '')}")
            continue
        print(f"  [{util.hhmmss(it['timeline_start'])}] {it['pa_id']:<5} "
              f"{it['title']:<20} {it['duration']:5.1f}s  "
              f"{it['file']} {util.hhmmss(it['src_in'])}  [{it['method']}]")
    if cuts["not_selected"]:
        print("\n次点（尺に入らなかった打席）:")
        for p in cuts["not_selected"][:6]:
            print(f"  {p['pa_id']} {half_label(p['half'])} {p['batter']} "
                  f"{p['result']} (score {p['score']})")
    print(f"\n保存しました: {util.WORK / 'cuts.json'}")
    return 0
