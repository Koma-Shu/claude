#!/usr/bin/env python3
"""キャップ野球ハイライト生成ツール。`python3 run.py <サブコマンド>` で使う。"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from capvid.cli import main  # noqa: E402

if __name__ == "__main__":
    sys.exit(main())
