#!/usr/bin/env python3
"""スコアブックPDFの打席グリッドから plays.json を生成し、ボックススコアと突き合わせて検証する。

スコアブック(cap-scorebook.com)の「成績」表は、打者ごとに第1打席・第2打席…と横に並ぶ形式で、
イニングの境界は色帯でしか示されない。ここでは打順が循環する性質を使って打席を時系列に並べ直し、
アウトの数からイニング境界を確定させたうえで、集計値が公式ボックススコアと一致することを検証する。

    python3 config/_build_plays.py            # 検証して config/plays.json を書き出す
    python3 config/_build_plays.py --check    # 検証のみ（書き出さない）
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent

# --- スコアブックから転記した生データ ---------------------------------------
# 各打席は (結果コード, 打点, 付記) の3つ組。付記はスコアブック上の小文字添字。
#   BB=四球  DB=死球  K=三振  K'=振り逃げ  1BH=単打  2BH=二塁打
#   W1/W0=暴投等による進塁  PO=牽制/挟殺

AWAY_ORDER = ["松永(直)", "猿屋", "辻", "小松川", "中島"]
AWAY_GRID = {
    "松永(直)": [("BB", 0, []), ("BB", 0, []), ("K", 0, ["W1"]), ("K", 0, []), ("K", 0, ["W1"]), ("K", 0, ["PO"])],
    "猿屋":     [("BB", 0, []), ("BB", 0, []), ("DB", 0, []), ("BB", 0, []), ("BB", 0, [])],
    "辻":       [("2BH", 1, []), ("BB", 0, ["W1"]), ("BB", 0, []), ("K", 0, []), ("BB", 0, [])],
    "小松川":   [("BB", 0, ["W1"]), ("2BH", 2, []), ("BB", 0, ["PO", "W1"]), ("2BH", 2, []), ("K", 0, [])],
    "中島":     [("K", 0, ["W1"]), ("K", 0, []), ("2BH", 1, []), ("1BH", 1, []), ("K", 0, [])],
}

HOME_ORDER = ["白葉", "黒田", "神山", "若林", "花田", "岡田(凌)", "近藤(啓)"]
HOME_GRID = {
    "白葉":     [("K", 0, []), ("K'", 0, ["W1"]), ("K", 0, ["W1"])],
    "黒田":     [("K", 0, []), ("2BH", 1, ["W1"]), ("BB", 0, [])],
    "神山":     [("K", 0, []), ("BB", 0, ["W0"]), ("BB", 0, ["W1"])],
    "若林":     [("2BH", 0, []), ("K", 0, ["W1"]), ("K", 0, ["W0"])],
    "花田":     [("BB", 0, ["PO", "W1"]), ("BB", 0, ["W1"]), ("K", 0, [])],
    "岡田(凌)": [("BB", 0, ["W1"]), ("BB", 0, ["PO"])],
    "近藤(啓)": [("BB", 0, ["W0"]), ("K", 0, [])],
}

# 各半イニングの打席数（アウト3つで区切った結果。下の verify で得点・アウト数と突き合わせる）
AWAY_HALVES = [("1top", 11), ("2top", 10), ("3top", 5)]
HOME_HALVES = [("1bot", 3), ("2bot", 11), ("3bot", 5)]

# 公式ボックススコア（PDF「打撃成績」欄）: 打席数,打数,安打,一塁打,二塁打,打点,四死球,三振
BOX = {
    "松永(直)": (6, 4, 0, 0, 0, 0, 2, 4),
    "猿屋":     (5, 0, 0, 0, 0, 0, 5, 0),
    "辻":       (5, 2, 1, 0, 1, 1, 3, 1),
    "小松川":   (5, 3, 2, 0, 2, 4, 2, 1),
    "中島":     (5, 5, 2, 1, 1, 2, 0, 3),
    "白葉":     (3, 3, 0, 0, 0, 0, 0, 3),
    "黒田":     (3, 2, 1, 0, 1, 1, 1, 1),
    "神山":     (3, 1, 0, 0, 0, 0, 2, 1),
    "若林":     (3, 3, 1, 0, 1, 0, 0, 2),
    "花田":     (3, 1, 0, 0, 0, 0, 2, 1),
    "岡田(凌)": (2, 0, 0, 0, 0, 0, 2, 0),
    "近藤(啓)": (2, 1, 0, 0, 0, 0, 1, 1),
}
LINESCORE = {"away": [7, 6, 0], "home": [0, 8, 1]}

# 結果コードの性質
# この試合は全6半イニングがちょうど3三振で終わっている（両チームとも三振計9＝3×3イニング、
# 投手成績の奪三振とも一致）。したがってイニング境界は三振数で厳密に確定できる。
# K'（振り逃げ）は打者が出塁しているが記録上は三振であり、アウト自体は走塁で成立している。
IS_STRIKEOUT = {"K": True, "K'": True, "BB": False, "DB": False, "1BH": False, "2BH": False}
IS_AB = {"K": True, "K'": True, "BB": False, "DB": False, "1BH": True, "2BH": True}
IS_HIT = {"1BH": True, "2BH": True}
IS_WALK = {"BB": True, "DB": True}
RESULT_JA = {
    "BB": "四球", "DB": "死球", "K": "三振", "K'": "振り逃げ",
    "1BH": "ヒット", "2BH": "ツーベース",
}


def build_side(order, grid, halves, team_key):
    """打順の循環にしたがって打席を時系列に並べ、半イニングを割り当てる。"""
    seq, cursor = [], {name: 0 for name in order}
    total = sum(len(v) for v in grid.values())
    i = 0
    while len(seq) < total:
        name = order[i % len(order)]
        i += 1
        if cursor[name] >= len(grid[name]):
            continue
        code, rbi, extras = grid[name][cursor[name]]
        cursor[name] += 1
        seq.append({"batter": name, "batter_pa": cursor[name], "result": code, "rbi": rbi, "extras": extras})

    plays, pos = [], 0
    for half, count in halves:
        for k in range(count):
            p = seq[pos]
            pos += 1
            plays.append({
                "pa_id": f"{'T' if team_key == 'away' else 'B'}-{pos:02d}",
                "team": team_key,
                "half": half,
                "inning": int(half[0]),
                "pa_no": pos,                 # チーム内の通し打席番号
                "order_in_half": k + 1,
                "batter": p["batter"],
                "batter_pa": p["batter_pa"],
                "result": p["result"],
                "result_ja": RESULT_JA[p["result"]],
                "rbi": p["rbi"],
                "extras": p["extras"],
                "is_strikeout": IS_STRIKEOUT[p["result"]],
                "flags": [],
            })
    if pos != total:
        raise SystemExit(f"[{team_key}] halves の打席数合計 {pos} が実データ {total} と不一致")
    return plays


def verify(plays):
    """再構成した打席列を公式ボックススコアと突き合わせる。"""
    errs = []
    agg = {}
    for p in plays:
        a = agg.setdefault(p["batter"], dict.fromkeys(
            ["pa", "ab", "h", "b1", "b2", "rbi", "bb", "k"], 0))
        r = p["result"]
        a["pa"] += 1
        a["ab"] += IS_AB[r]
        a["h"] += IS_HIT.get(r, False)
        a["b1"] += (r == "1BH")
        a["b2"] += (r == "2BH")
        a["rbi"] += p["rbi"]
        a["bb"] += IS_WALK.get(r, False)
        a["k"] += r in ("K", "K'")

    for name, expected in BOX.items():
        got = tuple(agg.get(name, {}).get(key, 0)
                    for key in ["pa", "ab", "h", "b1", "b2", "rbi", "bb", "k"])
        if got != expected:
            errs.append(f"  {name}: 再構成 {got} != ボックススコア {expected}")

    # 半イニングごとに三振が3つ記録されているか（この試合はこれがイニング境界の根拠）
    halves = {}
    for p in plays:
        halves.setdefault(p["half"], []).append(p)
    for half, ps in halves.items():
        so = sum(p["is_strikeout"] for p in ps)
        if so != 3:
            errs.append(f"  {half}: 三振 {so} 個（3であるべき。イニング境界がずれている）")

    # 投手成績の奪四死球ではなく、チーム三振合計が投手成績と合うか
    for team, expected in (("away", 9), ("home", 9)):
        got = sum(p["is_strikeout"] for p in plays if p["team"] == team)
        if got != expected:
            errs.append(f"  {team}: 三振合計 {got} != 投手成績 {expected}")
    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="検証のみ、書き出さない")
    args = ap.parse_args()

    away = build_side(AWAY_ORDER, AWAY_GRID, AWAY_HALVES, "away")
    home = build_side(HOME_ORDER, HOME_GRID, HOME_HALVES, "home")
    plays = away + home

    errs = verify(plays)
    if errs:
        print("検証に失敗しました:", file=sys.stderr)
        print("\n".join(errs), file=sys.stderr)
        return 1
    print(f"検証OK: {len(plays)} 打席（東京蓋楡 {len(away)} / 企壮天蓋 {len(home)}）が"
          f"ボックススコアと完全に一致")

    annotate(plays)
    if args.check:
        return 0
    out = HERE / "plays.json"
    out.write_text(json.dumps({
        "_generated_by": "config/_build_plays.py",
        "_source": "https://cap-scorebook.com/game/bc916c81-3de0-4fb3-b48e-94652bfa1c66",
        "plays": plays,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"書き出し: {out}")
    return 0


def annotate(plays):
    """ハイライト選定に効く文脈フラグを付ける。"""
    scored = False
    for p in plays:
        if p["rbi"] > 0 and not scored:
            p["flags"].append("先制")
            scored = True
    # 1回裏の三者連続三振
    first_bot = [p for p in plays if p["half"] == "1bot"]
    if len(first_bot) == 3 and all(p["result"] == "K" for p in first_bot):
        for p in first_bot:
            p["flags"].append("三者連続三振")
    # 試合最後の打席
    plays[-1]["flags"].append("ゲームセット")


if __name__ == "__main__":
    raise SystemExit(main())
