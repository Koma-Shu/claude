#!/bin/sh
# 全テストをまとめて走らせる。パイプで終了ステータスを潰さないこと。
set -u
cd "$(dirname "$0")"
fail=0
run() {
  out=$("$@" 2>&1) && echo "  OK  $*" || { echo "  NG  $*"; echo "$out" | tail -6; fail=1; }
}
run python3 config/_build_plays.py --check
run python3 tests/test_font_ranking.py
run python3 tests/test_anchor_suggest.py
run python3 tests/e2e_synthetic.py
CAPVID_DISABLE_FILTERS=ass run python3 tests/e2e_synthetic.py
echo "---"
[ "$fail" -eq 0 ] && echo "全テスト通過" || echo "失敗あり"
exit "$fail"
