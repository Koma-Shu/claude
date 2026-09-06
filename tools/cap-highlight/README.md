# キャップ野球 ハイライト動画生成ツール

定点カメラの試合動画とスコアブックから、テロップ入りの約5分ハイライトを作る。

対象試合: **2026/08/09 東京蓋楡 13 - 9 企壮天蓋**
（[スコアブック](https://cap-scorebook.com/game/bc916c81-3de0-4fb3-b48e-94652bfa1c66)）

## 考え方

スコアブックには「試合開始からの経過時間」が無いので、打席と映像を直接は結べない。
そこで3段構えで位置を決める。

1. **打席の並べ直し** — スコアブックの成績表は打者ごとに横並びなので、打順の循環を
   使って時系列に戻す。この試合は全6半イニングがちょうど3三振で終わっており、
   イニング境界が三振数で厳密に確定する（`config/_build_plays.py` が
   ボックススコアとの一致を検証する）。
2. **線形補間** — 半イニングあたり2点（最初の投球・最後のアウト）だけ人が入力し、
   打席番号で内挿する。
3. **歓声へのスナップ** — 内挿位置の周辺で音量のピークを探し、その立ち上がりに寄せる。
   打席順と時刻順が食い違わないよう単調に、かつ1つのピークは1打席にだけ割り当てる。

残ったズレは `preview` のサムネイルで潰す。

## 準備

```bash
brew install ffmpeg          # Ubuntu/Debian なら sudo apt install ffmpeg
pip3 install -r requirements.txt
```

揃っているか確認する:

```bash
python3 run.py doctor
```

`ffmpeg` と `ffprobe`、必要なフィルタ、日本語フォントの有無をまとめて見る。
pip の `imageio-ffmpeg` は `ffmpeg` 本体しか同梱せず `ffprobe` を含まないため、
それだけでは `probe` コマンドが動かない。

### テロップの描画方法

ffmpeg の配布ビルドは構成が一定でなく、freetype や libass を含まないことがある
（Homebrew 版でしばしば起きる）。そのため描画経路を2つ持っている。

| 条件 | 方法 |
|---|---|
| `ass` フィルタがある | ASS 字幕を最終パスで焼き込む |
| `ass` フィルタが無い | Pillow でテロップを PNG に描き、`overlay` で合成する |

どちらを使うかは `render` が自動で決める。見た目は同じ。後者はフォントを
ファイルとして直接探すので、`fc-list` も要らない。特定のフォントファイルを
使いたいときは `config/style.json` に `font.file` でパスを書く
（`.ttc` なら `font.file_index` も）。

`CAPVID_DISABLE_FILTERS=ass` を付けて実行すると、`ass` があっても
PNG 経路を試せる。

日本語フォントは `config/style.json` の `font.name` の候補を上から順に探し、
最初に見つかったものを使う（macOS なら `Hiragino Sans`）。候補に無いフォントを
使いたいときは、その名前を先頭に足す。自動で拾えない場合は `font.fontsdir` に
.ttf/.otf のあるディレクトリを指定する。

## 手順

```bash
# 0. 環境確認
python3 run.py doctor

# 1. 動画を取得（約4.2GB）。gdown か rclone を使う
python3 run.py fetch
python3 run.py fetch --rclone-remote gdrive
python3 run.py fetch --list

# 2. 動画の長さ・解像度・fps を計測
python3 run.py probe

# 3. イニングと動画内タイムコードの対応づけ（唯一の手作業）
python3 run.py scan              # 動画全体を時刻つきサムネイル一覧にする
#   → work/scan/*.png を見て「最初の投球」「最後の打席が終わった瞬間」を探す。
#      画像をそのまま Claude Code に読ませて時刻を読み取らせてもよい。
python3 run.py anchors init      # work/anchors.csv を生成
#   → 各行に start_tc / end_tc を記入する
#      start_tc = その半イニング先頭打者への最初の投球
#      end_tc   = そのセグメント最後の打席が終わった瞬間
#      書式は 1:23 / 0:01:23.5 / 83.5 のいずれでも可
python3 run.py anchors check     # 検証して確定

# 4. 歓声・打球音のピークを検出
python3 run.py peaks

# 5. ハイライトを選定してカット割りを作る
python3 run.py plan
python3 run.py plan --duration 300 --include T-03 B-19 --exclude T-11

# 6. カット位置を確認（重要）
python3 run.py preview           # work/preview/*.png
python3 run.py preview --video   # 低解像度の動画も出す
#   → ズレていたら work/pa_anchors.csv にその打席の実測タイムコードを書き、
#      anchors check → plan をやり直す

# 7. 書き出し
python3 run.py render            # out/highlight.mp4
```

`preview` が出す PNG は Claude Code にそのまま読ませられる。
「このサムネイルを見てズレている打席を指摘して」と頼めば、補正すべき打席を絞り込める。

## お手本動画に寄せる

```bash
python3 run.py reference          # yt-dlp が必要
```

`work/reference/frames/` に等間隔フレーム、`reference.json` にカット数と1カットの
長さの中央値が出る。フレームを Claude Code に読ませて、テロップの書式・位置・配色を
`config/style.json` に反映する。

## 設定

| ファイル | 内容 |
|---|---|
| `config/game.json` | チーム・スコア・動画とイニングの対応 |
| `config/plays.json` | 45打席のデータ（`_build_plays.py` が生成） |
| `config/style.json` | 解像度・尺・テロップ書式・BGM・選定スコア |

打席データを直したいときは `config/_build_plays.py` の `AWAY_GRID` / `HOME_GRID` を
編集して再生成する。ボックススコアと合わなければエラーで止まる。

```bash
python3 config/_build_plays.py --check   # 検証のみ
python3 run.py plays                     # 45打席を一覧表示
```

テロップの座標とサイズは 1920x1080 を基準に書く。出力解像度を変えても libass が
等倍でスケールするので `style.json` を書き換える必要はない。

BGM を入れるなら `style.json` の `audio.bgm_path` に音源のパスを指定する。
`duck_bgm` が真なら試合音声に合わせて自動で音量を下げる。

## 別の試合に使う

`CAPVID_ROOT` に試合ごとのディレクトリを指すと、`config/` `work/` `out/` を
そちらに置ける。

```bash
mkdir -p ~/cap/2026-09-13 && cp -r config ~/cap/2026-09-13/
CAPVID_ROOT=~/cap/2026-09-13 python3 run.py probe
```

## テスト

実素材が無くてもパイプラインを検証できる。合成動画を作って全工程を通し、
打席位置の重複・順序の逆転・尺のズレを自動でチェックする。

```bash
python3 tests/e2e_synthetic.py     # 全工程を合成動画で通す
python3 tests/test_font_ranking.py # 日本語フォントの選び方
```

配布ビルドの ffmpeg は構成が一定でなく、`drawtext`(freetype) を欠くことがある。
`drawtext` はこのテストが合成動画にタイムコードを焼くためだけに使っており、
無い場合は自動的に省略して続行する（本体は使っていない）。

## この試合のハイライト候補

`plan` はスコアと尺の予算で自動選定するが、実質的な見どころは以下。

| 打席ID | 場面 | 内容 |
|---|---|---|
| `T-03` | 1回表 | 辻のツーベースで先制 |
| `T-09` | 1回表 | 小松川のツーベース（2打点） |
| `B-01`〜`B-03` | 1回裏 | 猿屋が三者連続三振（被安打0・無失点） |
| `B-04` | 2回裏 | 若林のツーベースから8点の猛反撃が始まる |
| `B-09` | 2回裏 | 黒田の適時ツーベース |
| `T-15` | 2回表 | 中島のツーベース（1打点） |
| `T-19` | 2回表 | 小松川のツーベース（2打点） |
| `T-20` | 2回表 | 中島のタイムリー |
| `B-19` | 3回裏 | 花田の三振でゲームセット |

## 制約

- スコアブックのサイト（cap-scorebook.com）からは直接データを取っていない。
  打席データは PDF から起こしてボックススコアで検証している。
- `IMG_5382.MOV` は録画ミスのため除外している（`config/game.json` の `excluded`）。
- 2回裏は捕手交代（猿屋 → 小松川）を境に `IMG_5381` と `IMG_5383` に分かれる。
  分割位置は捕手の守備イニング数（0.33 / 1.33）から算出した推定なので、
  `preview` で確認して必要なら `game.json` の `pa_range` を直す。
