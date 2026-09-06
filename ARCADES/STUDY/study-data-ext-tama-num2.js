/* study-data-ext-tama-num2.js — 玉手箱 計数「表の空欄推測」
   玉手箱の計数3形式のうちの一つ。計算式は与えられず、表の行・列に潜む規則
   （項目どうしの相関）を自分で見抜いて、空欄(?)に入る数値を推測する形式。 */
(window.STUDY_DATA = window.STUDY_DATA || []).push(

  { id:'tama-num-y01', cat:'tama-num', topic:'表の空欄推測', diff:2, type:'mc',
    q:`次の表の「?」に最も近い数値を選べ。各店の来客数・購入率・売上の関係に着目せよ。<br>
       <table class="qtable"><tr><th>店</th><th>来客数</th><th>購入率</th><th>売上(万円)</th></tr>
       <tr><td>A</td><td>200</td><td>40%</td><td>160</td></tr>
       <tr><td>B</td><td>300</td><td>50%</td><td>300</td></tr>
       <tr><td>C</td><td>400</td><td>30%</td><td>?</td></tr></table>`,
    choices:['180','200','240','300'], answer:2,
    exp:`<p>完成している行から関係を見抜きます。売上 ÷（来客数 × 購入率）を計算すると、<br>A: 160 ÷ (200×0.4)=160÷80=2、 B: 300 ÷ (300×0.5)=300÷150=2。<br>つまり <b>売上 = 来客数 × 購入率 × 2</b>（客単価2万円）という規則です。</p>
       <p>C に当てはめると 400 × 0.3 × 2 = <b>240</b>。</p>
       <p class="tip">▶ 表の空欄推測は「計算式が与えられない」のがポイント。<b>そろっている行から規則を逆算</b>し、それを空欄の行に当てはめる。</p>` },

  { id:'tama-num-y02', cat:'tama-num', topic:'表の空欄推測', diff:1, type:'mc',
    q:`次の表の「?」に入る数値を選べ。縦・横・面積の関係に着目せよ。<br>
       <table class="qtable"><tr><th>縦</th><th>横</th><th>面積</th></tr>
       <tr><td>4</td><td>5</td><td>20</td></tr>
       <tr><td>6</td><td>3</td><td>18</td></tr>
       <tr><td>7</td><td>8</td><td>?</td></tr></table>`,
    choices:['49','54','56','63'], answer:2,
    exp:`<p>各行で 面積 = 縦 × 横 が成り立っています（4×5=20、6×3=18）。</p><p>よって 7 × 8 = <b>56</b>。</p><p class="tip">▶ まず2つの列を掛けたり足したりして、3列目になる組合せを探す。最も基本的な相関は「積」と「和」。</p>` },

  { id:'tama-num-y03', cat:'tama-num', topic:'表の空欄推測', diff:2, type:'mc',
    q:`次の表は、ある会社の年ごとの売上である。「?」に入る数値を選べ。<br>
       <table class="qtable"><tr><th>年</th><th>売上(万円)</th></tr>
       <tr><td>1年目</td><td>100</td></tr>
       <tr><td>2年目</td><td>200</td></tr>
       <tr><td>3年目</td><td>400</td></tr>
       <tr><td>4年目</td><td>?</td></tr></table>`,
    choices:['600','700','800','1000'], answer:2,
    exp:`<p>前の年に対する比を見ると、200÷100=2、400÷200=2 と<b>毎年2倍</b>になっています（等比）。</p><p>4年目 = 400 × 2 = <b>800</b>。</p><p class="tip">▶ 縦に並ぶ数値は「差が一定（等差）」か「比が一定（等比）」かをまず確認。倍々に増えるなら等比。</p>` },

  { id:'tama-num-y04', cat:'tama-num', topic:'表の空欄推測', diff:1, type:'mc',
    q:`次の表の「?」に入る数値を選べ。収入・支出・残りの関係に着目せよ。<br>
       <table class="qtable"><tr><th>月</th><th>収入</th><th>支出</th><th>残り</th></tr>
       <tr><td>1月</td><td>50</td><td>30</td><td>20</td></tr>
       <tr><td>2月</td><td>80</td><td>45</td><td>35</td></tr>
       <tr><td>3月</td><td>70</td><td>40</td><td>?</td></tr></table>`,
    choices:['25','30','35','40'], answer:1,
    exp:`<p>各行で 残り = 収入 − 支出 です（50−30=20、80−45=35）。</p><p>3月 = 70 − 40 = <b>30</b>。</p><p class="tip">▶ 3列の関係は、積・和のほかに<b>差</b>も疑う。「収入−支出＝残り」のような自然な意味の対応に気づくと速い。</p>` },

  { id:'tama-num-y05', cat:'tama-num', topic:'表の空欄推測', diff:2, type:'mc',
    q:`次の表の「?」に入る数値を選べ。売上と利益の関係に着目せよ。<br>
       <table class="qtable"><tr><th>商品</th><th>売上(万円)</th><th>利益(万円)</th></tr>
       <tr><td>A</td><td>500</td><td>100</td></tr>
       <tr><td>B</td><td>800</td><td>160</td></tr>
       <tr><td>C</td><td>1200</td><td>?</td></tr></table>`,
    choices:['180','200','240','300'], answer:2,
    exp:`<p>利益 ÷ 売上 を計算すると、100÷500=0.2、160÷800=0.2。つまり<b>利益率が一定（20%）</b>です。</p><p>C: 1200 × 0.2 = <b>240</b>。</p><p class="tip">▶ 「一方を他方で割ると一定値（割合）」というパターンも頻出。利益率・購入率・歩留まりなどが固定されている表に多い。</p>` },

  { id:'tama-num-y06', cat:'tama-num', topic:'表の空欄推測', diff:2, type:'mc',
    q:`次の表の「?」に入る数値を選べ。各班の総額・人数・1人あたりの関係に着目せよ。<br>
       <table class="qtable"><tr><th>班</th><th>総額(円)</th><th>人数</th><th>1人あたり(円)</th></tr>
       <tr><td>A</td><td>6000</td><td>3</td><td>2000</td></tr>
       <tr><td>B</td><td>10000</td><td>5</td><td>2000</td></tr>
       <tr><td>C</td><td>8000</td><td>4</td><td>?</td></tr></table>`,
    choices:['1500','1800','2000','2400'], answer:2,
    exp:`<p>1人あたり = 総額 ÷ 人数 です（6000÷3=2000、10000÷5=2000）。どの班も1人あたり2000円で一定。</p><p>C: 8000 ÷ 4 = <b>2000</b>。</p><p class="tip">▶ 「総額・人数・1人あたり」のように<b>割り算で結ばれる3列</b>は典型。完成行で割って一定値を確かめる。</p>` },

  { id:'tama-num-y07', cat:'tama-num', topic:'表の空欄推測', diff:2, type:'mc',
    q:`次の表の「?」に入る数値を選べ。2科目の点数と平均点の関係に着目せよ。<br>
       <table class="qtable"><tr><th>生徒</th><th>国語</th><th>数学</th><th>平均</th></tr>
       <tr><td>P</td><td>60</td><td>80</td><td>70</td></tr>
       <tr><td>Q</td><td>90</td><td>70</td><td>80</td></tr>
       <tr><td>R</td><td>50</td><td>70</td><td>?</td></tr></table>`,
    choices:['55','60','65','70'], answer:1,
    exp:`<p>平均 = (国語 + 数学) ÷ 2 です（(60+80)/2=70、(90+70)/2=80）。</p><p>R: (50+70) ÷ 2 = 120 ÷ 2 = <b>60</b>。</p><p class="tip">▶ 「平均」列があれば (A+B)/2 を疑う。2列を足して2で割った値と一致するかで確認する。</p>` },

  { id:'tama-num-y08', cat:'tama-num', topic:'表の空欄推測', diff:3, type:'mc',
    q:`次の表（縦横の見出し付き）の「?」に入る数値を選べ。表の各マスの数は、その行・列の見出しと一定の関係にある。<br>
       <table class="qtable"><tr><th></th><th>列1</th><th>列2</th><th>列3</th></tr>
       <tr><th>行2</th><td>2</td><td>4</td><td>6</td></tr>
       <tr><th>行3</th><td>3</td><td>6</td><td>?</td></tr></table>`,
    choices:['7','8','9','12'], answer:2,
    exp:`<p>各マスの数は「<b>行番号 × 列番号</b>」になっています。<br>行2: 2×1=2, 2×2=4, 2×3=6 ✓／ 行3: 3×1=3, 3×2=6 ✓。</p><p>「?」は 行3 × 列3 = 3 × 3 = <b>9</b>。</p><p class="tip">▶ 縦横に見出しのある表は<b>二次元の相関</b>を疑う。行と列の見出しを掛ける／足すと各マスになる規則が多い。</p>` }

);
