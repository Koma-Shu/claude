/* study-data-verbal.js — SPI言語 + 玉手箱(言語/英語) 追加問題 */
(window.STUDY_DATA = window.STUDY_DATA || []).push(

// ════════════════════════════════════════════════════════════════════════
//  SPI 言語 (spi-verb) 追加 12問
// ════════════════════════════════════════════════════════════════════════
  {
    id:'spi-verb-x01', cat:'spi-verb', topic:'二語の関係（原料）', diff:1, type:'mc',
    q:`最初に示した二語と同じ関係になる組み合わせを選べ。<br><b>ワイン：ぶどう</b>`,
    choices:['パン：小麦','料理：包丁','牛乳：チーズ','米：稲'], answer:0,
    exp:`<p>「ワイン：ぶどう」は <b>製品：その原料</b> の関係です。ワインはぶどうから作られます。</p>
       <p>・パン：小麦 → 製品：原料 ✓（パンは小麦から作る）<br>
          ・料理：包丁 → 製品：道具（関係が違う）<br>
          ・牛乳：チーズ → 原料：製品（順序が逆）<br>
          ・米：稲 → 順序が逆かつ原料関係が弱い</p>
       <p>よって <b>パン：小麦</b>。</p>
       <p class="tip">▶ 原料関係は「<b>AはBから作られる</b>」が成り立つか、さらに<b>順序（製品→原料か原料→製品か）</b>まで一致させること。</p>`
  },
  {
    id:'spi-verb-x02', cat:'spi-verb', topic:'二語の関係（用途）', diff:2, type:'mc',
    q:`最初に示した二語と同じ関係になる組み合わせを選べ。<br><b>はさみ：切る</b>`,
    choices:['鉛筆：書く','時計：時間','本：図書館','靴：足'], answer:0,
    exp:`<p>「はさみ：切る」は <b>道具：その用途（する動作）</b> の関係です。はさみは切るために使います。</p>
       <p>・鉛筆：書く → 道具：用途 ✓（鉛筆は書くために使う）<br>
          ・時計：時間 → 道具：示す対象（動作ではない）<br>
          ・本：図書館 → もの：置かれる場所<br>
          ・靴：足 → もの：身につける部位</p>
       <p>よって <b>鉛筆：書く</b>。</p>
       <p class="tip">▶ 用途関係は「<b>AはBするために使う</b>」と文にして確認。二つ目が「動作（用途）」かどうかが見分けの鍵です。</p>`
  },
  {
    id:'spi-verb-x03', cat:'spi-verb', topic:'語句の用法（多義語）', diff:2, type:'mc',
    q:`下線部「かける」と<b>同じ意味</b>で使われているものを選べ。<br>「壁に時計を<u>かける</u>。」`,
    choices:['電話を<u>かける</u>','迷惑を<u>かける</u>','コートを衣紋掛けに<u>かける</u>','保険を<u>かける</u>'], answer:2,
    exp:`<p>例文の「かける」は、<b>物を高い所に引っ掛けてつるす・取り付ける</b>という意味です。</p>
       <p>・電話をかける → 通信を行う<br>
          ・迷惑をかける → 負担などを及ぼす<br>
          ・<b>コートを衣紋掛けにかける → 引っ掛けてつるす</b> ✓<br>
          ・保険をかける → 契約・備えをする</p>
       <p>よって <b>「コートを衣紋掛けにかける」</b>。</p>
       <p class="tip">▶ 多義語の用法問題は、その語を<b>別の言葉に言い換え</b>てみるのがコツ。「時計をかける＝つるす」と言い換えられるものを探します。</p>`
  },
  {
    id:'spi-verb-x04', cat:'spi-verb', topic:'語句の用法（助詞）', diff:3, type:'mc',
    q:`下線部の助詞「で」と<b>同じ用法</b>のものを選べ。<br>「彼はペン<u>で</u>手紙を書いた。」`,
    choices:['風邪<u>で</u>学校を休む','公園<u>で</u>遊ぶ','バス<u>で</u>通学する','三日<u>で</u>完成した'], answer:2,
    exp:`<p>例文の「で」は、<b>手段・道具</b>を表す格助詞です（ペンを使って書く）。</p>
       <p>・風邪で休む → <b>原因・理由</b>の「で」<br>
          ・公園で遊ぶ → <b>場所</b>の「で」<br>
          ・<b>バスで通学する → 手段・道具</b>の「で」 ✓<br>
          ・三日で完成した → <b>期限・限度</b>の「で」</p>
       <p>よって <b>「バスで通学する」</b>。</p>
       <p class="tip">▶ 助詞「で」は①手段（〜を使って）②場所（〜において）③原因（〜のために）④期限などを表します。言い換えて用法を特定しましょう。</p>`
  },
  {
    id:'spi-verb-x05', cat:'spi-verb', topic:'文の並べ替え', diff:2, type:'mc',
    q:`次のア〜エを意味が通るように並べ替えたとき、正しい順序はどれか。<br>
       ア しかし、続けるうちに少しずつ慣れていった。<br>
       イ 私は人前で話すのが大の苦手だった。<br>
       ウ いまでは大勢の前でも落ち着いて話せる。<br>
       エ そこで、毎週小さな発表の場に参加することにした。`,
    choices:['イ→エ→ア→ウ','イ→ア→エ→ウ','エ→イ→ア→ウ','イ→ウ→エ→ア'], answer:0,
    exp:`<p>接続語と内容の流れから、<b>出発点→行動→変化→結末</b>でつなぎます。</p>
       <p>イ（苦手だった＝出発点）→ エ（そこで参加することにした＝行動）→ ア（しかし慣れていった＝変化）→ ウ（いまでは話せる＝結末）。</p>
       <p>よって <b>イ→エ→ア→ウ</b>。</p>
       <p class="tip">▶ 「そこで（だから行動）」「しかし（逆接の変化）」「いまでは（現在の結果）」と、<b>接続語が時間と論理の順序</b>を教えてくれます。</p>`
  },
  {
    id:'spi-verb-x06', cat:'spi-verb', topic:'空欄補充（接続詞）', diff:1, type:'mc',
    q:`空欄に入る最も適切な語を選べ。<br>「彼は十分に準備をしていた。（　　）、本番では緊張して実力を出せなかった。」`,
    choices:['だから','つまり','ところが','そのうえ'], answer:2,
    exp:`<p>前半「準備をしていた」に対し、後半「実力を出せなかった」は<b>予想に反する結果</b>です。<b>逆接</b>の接続語が入ります。</p>
       <p>・だから → 順接（×）／・つまり → 言い換え（×）／・そのうえ → 添加（×）／・<b>ところが</b> → 逆接 ○</p>
       <p>よって <b>ところが</b>。</p>
       <p class="tip">▶ 「準備した→（普通なら成功するはずが）失敗した」のように<b>期待と結果が食い違う</b>ときは逆接（しかし・ところが・だが）。</p>`
  },
  {
    id:'spi-verb-x07', cat:'spi-verb', topic:'熟語の成り立ち', diff:2, type:'mc',
    q:`「<b>豊富</b>」と同じ成り立ち（構成）の熟語を選べ。`,
    choices:['登山','読書','森林','勝敗'], answer:2,
    exp:`<p>「豊富」＝豊か・富む、いずれも<b>似た意味の漢字を重ねた</b>構成です。</p>
       <p>・登山 → 山に登る（動詞＋目的語）<br>
          ・読書 → 書を読む（動詞＋目的語）<br>
          ・<b>森林 → 森・林、いずれも「木の集まり」で似た意味の重複</b> ✓<br>
          ・勝敗 → 勝つ⇔敗れる（反対の意味の字）</p>
       <p>よって <b>森林</b>。</p>
       <p class="tip">▶ 熟語の構成パターン:①似た意味（森林・豊富）②反対（勝敗）③修飾＋被修飾 ④主語＋述語 ⑤動詞＋目的語（登山・読書）。</p>`
  },
  {
    id:'spi-verb-x08', cat:'spi-verb', topic:'類義語', diff:2, type:'mc',
    q:`「<b>是非</b>」と最も意味の近い語を選べ。<br>「計画の<u>是非</u>を問う。」`,
    choices:['長所','良し悪し','賛成','可能性'], answer:1,
    exp:`<p><b>是非（ぜひ）</b>＝よいことと悪いこと、物事の<b>良し悪し</b>。「是＝正しい／非＝誤り」から成ります。</p>
       <p>「是非を問う」＝<b>良いか悪いか（採否）を判断する</b>こと。</p>
       <p>・長所 → 良い面だけ（×）／・賛成 → 一方の立場（×）／・可能性 → 別概念（×）。よって <b>良し悪し</b>。</p>
       <p class="tip">▶ 「是非」には①良し悪し（名詞）②ぜひとも（副詞）の二つがあります。名詞の「是非を問う／是非を論じる」は<b>良し悪し</b>の意味です。</p>`
  },
  {
    id:'spi-verb-x09', cat:'spi-verb', topic:'対義語', diff:1, type:'mc',
    q:`「<b>具体</b>」の対義語として最も適切なものを選べ。`,
    choices:['抽象','客観','理論','現実'], answer:0,
    exp:`<p><b>具体</b>＝形や内容がはっきりしていて分かりやすいこと。これに対し、共通する性質だけを取り出して一般化することを <b>抽象</b>といいます。</p>
       <p>「具体的⇔抽象的」は対概念として頻出。客観⇔主観、理論⇔実践、現実⇔理想がそれぞれの対義語です。</p>
       <p>よって <b>抽象</b>。</p>
       <p class="tip">▶ 対義語はペアで暗記:具体⇔抽象、主観⇔客観、理論⇔実践、現実⇔理想、原因⇔結果。</p>`
  },
  {
    id:'spi-verb-x10', cat:'spi-verb', topic:'ことわざ・慣用句', diff:2, type:'mc',
    q:`「<b>立て板に水</b>」の意味として最も適切なものを選べ。`,
    choices:['とても流暢によどみなく話すこと','話のつじつまが合わないこと','一度にたくさんのことをすること','努力が無駄に終わること'], answer:0,
    exp:`<p><b>立て板に水</b>＝立てかけた板に水を流すとよどみなく流れることから、<b>すらすらとよどみなく話すさま</b>を表します。</p>
       <p>反対に、話がつかえてうまく進まない様子は「横板に雨垂れ」などと言います。</p>
       <p>よって <b>とても流暢によどみなく話すこと</b>。</p>
       <p class="tip">▶ 似た表現に「立て板に水＝弁が立つ」。一方「能ある鷹は爪を隠す」は実力者ほど控えめという別の意味なので混同しないこと。</p>`
  },
  {
    id:'spi-verb-x11', cat:'spi-verb', topic:'敬語', diff:3, type:'mc',
    q:`取引先に対する言い方として<b>最も適切な敬語</b>を選べ。<br>「（あなたが）資料を見ましたか」と尋ねたい。`,
    choices:['資料を拝見しましたか','資料をご覧になりましたか','資料を見られましたか','資料を拝見されましたか'], answer:1,
    exp:`<p>相手の動作を高めるので<b>尊敬語</b>を使います。「見る」の尊敬語は <b>ご覧になる</b>。</p>
       <p>・拝見する → <b>謙譲語</b>（自分が見る）なので相手には使えない（×）<br>
          ・見られる → 尊敬の助動詞「れる」だが「ご覧になる」より敬意が低く、可能・受身と紛らわしい（△）<br>
          ・拝見される → 謙譲語＋尊敬で<b>二重敬語の誤用</b>（×）</p>
       <p>よって <b>「資料をご覧になりましたか」</b>。</p>
       <p class="tip">▶ 相手の動作＝尊敬語、自分の動作＝謙譲語。「見る」は尊敬=ご覧になる／謙譲=拝見する。混同が頻出ポイントです。</p>`
  },
  {
    id:'spi-verb-x12', cat:'spi-verb', topic:'長文読解（内容一致）', diff:3, type:'mc',
    q:`次の文章の内容と<b>合致する</b>ものを選べ。<br>
       <i>「外国語の習得において、文法の知識は確かに重要である。しかし、文法を完璧にしてから話そうとすると、いつまでも口を開けないままになりがちだ。多少間違えても実際に使ってみることが、上達への近道である。」</i>`,
    choices:['文法の知識は習得に不要である','間違いを恐れず使うことが上達につながる','話す前に文法を完璧にすべきである','外国語は独学では習得できない'], answer:1,
    exp:`<p>本文は「文法も重要だ。<b>しかし</b>多少間違えても実際に使うことが上達への近道だ」と述べています。</p>
       <p>逆接「しかし」の後ろに筆者の主張があり、それは<b>「間違いを恐れず使うことが上達につながる」</b>。</p>
       <p>「文法は不要」は言い過ぎ（本文は「重要」と認めている）、「完璧にすべき」は本文が否定、「独学できない」は本文に記載なし。</p>
       <p class="tip">▶ 内容一致は<b>言い過ぎ・書いていない・正反対</b>の3パターンを消去。「しかし」の後の主張を軸に照合します。</p>`
  },

// ════════════════════════════════════════════════════════════════════════
//  玉手箱 (tama) 言語・英語 追加 12問
// ════════════════════════════════════════════════════════════════════════
  {
    id:'tama-v-x01', cat:'tama', topic:'論理的読解（GAB形式）', diff:2, type:'mc',
    q:`次の文章を読み、設問の文がどれにあたるか選べ。<br>
       <i>「当社の本社は東京にあり、社員数はおよそ500人である。昨年、大阪に新しい支社を開設した。」</i><br>
       <b>設問:「当社は大阪に支社を持っている。」</b>`,
    choices:['本文から論理的に明らかに正しい','本文から論理的に明らかに誤り','本文だけからは判断できない'], answer:0,
    exp:`<p>本文に「昨年、大阪に新しい支社を開設した」と明記されています。開設した＝現在その支社を持っている、と読めます。</p>
       <p>設問「大阪に支社を持っている」は本文の記述と一致するので <b>論理的に明らかに正しい（A）</b>。</p>
       <p class="tip">▶ GABはA:正しい／B:誤り／C:判断できない。本文に直接書かれた事実を言い換えただけの設問はAです。</p>`
  },
  {
    id:'tama-v-x02', cat:'tama', topic:'論理的読解（GAB形式）', diff:2, type:'mc',
    q:`次の文章を読み、設問の文がどれにあたるか選べ。<br>
       <i>「当社の本社は東京にあり、社員数はおよそ500人である。昨年、大阪に新しい支社を開設した。」</i><br>
       <b>設問:「当社の社員数はちょうど500人である。」</b>`,
    choices:['本文から論理的に明らかに正しい','本文から論理的に明らかに誤り','本文だけからは判断できない'], answer:1,
    exp:`<p>本文は「社員数は<b>およそ</b>500人」と述べています。「およそ（約）」は概算であり、「<b>ちょうど</b>500人」と断定はできません。</p>
       <p>設問は「ちょうど500人」と本文より強く言い切っており、本文と食い違います。よって <b>論理的に明らかに誤り（B）</b>。</p>
       <p class="tip">▶ 「およそ・約・主に・多くの」を「ちょうど・すべて・〜だけ」と言い換えた設問は、本文より強い断定なのでB（誤り）になりがちです。</p>`
  },
  {
    id:'tama-v-x03', cat:'tama', topic:'論理的読解（GAB形式）', diff:2, type:'mc',
    q:`次の文章を読み、設問の文がどれにあたるか選べ。<br>
       <i>「当社の本社は東京にあり、社員数はおよそ500人である。昨年、大阪に新しい支社を開設した。」</i><br>
       <b>設問:「大阪支社には100人の社員が勤務している。」</b>`,
    choices:['本文から論理的に明らかに正しい','本文から論理的に明らかに誤り','本文だけからは判断できない'], answer:2,
    exp:`<p>本文は会社全体の社員数（およそ500人）と大阪支社の開設を述べていますが、<b>大阪支社の社員数</b>については一切触れていません。</p>
       <p>本文に書かれていない情報なので、設問の真偽は <b>本文だけからは判断できない（C）</b>。</p>
       <p class="tip">▶ GABの鉄則:本文に書いていない数値・事実はC。常識や推測で人数を当てはめてA/Bにしてはいけません。</p>`
  },
  {
    id:'tama-v-x04', cat:'tama', topic:'論理的読解（GAB形式）', diff:3, type:'mc',
    q:`次の文章を読み、設問の文がどれにあたるか選べ。<br>
       <i>「このカフェは平日の朝7時に開店し、夜10時に閉店する。週末は終日休業である。」</i><br>
       <b>設問:「このカフェは日曜日の昼に営業している。」</b>`,
    choices:['本文から論理的に明らかに正しい','本文から論理的に明らかに誤り','本文だけからは判断できない'], answer:1,
    exp:`<p>本文に「週末は終日休業である」とあります。日曜日は週末にあたるため、<b>日曜は終日営業していない</b>ことになります。</p>
       <p>設問「日曜日の昼に営業している」は本文と矛盾するので <b>論理的に明らかに誤り（B）</b>。</p>
       <p class="tip">▶ 「週末＝土日」「終日＝一日中」のように本文の語の意味から論理的に導けるものはA/B判定できます。「日曜の昼」も「週末・終日休業」に含まれるためBです。</p>`
  },
  {
    id:'tama-v-x05', cat:'tama', topic:'論理的読解（GAB形式）', diff:2, type:'mc',
    q:`次の文章を読み、設問の文がどれにあたるか選べ。<br>
       <i>「ある調査によると、リモートワークを導入した企業の多くで、通勤時間の削減により従業員の自由時間が増えたと報告されている。」</i><br>
       <b>設問:「リモートワークを導入したすべての企業で、従業員の自由時間が増えた。」</b>`,
    choices:['本文から論理的に明らかに正しい','本文から論理的に明らかに誤り','本文だけからは判断できない'], answer:1,
    exp:`<p>本文は「導入した企業の<b>多く</b>で…報告されている」と述べています。「多く」であって「<b>すべて</b>」ではありません。</p>
       <p>設問は「すべての企業で増えた」と全称に拡大しており、本文の「多く」と食い違います。よって <b>論理的に明らかに誤り（B）</b>。</p>
       <p class="tip">▶ 「多く・一部・主に」を「すべて・全員」に置き換えた設問は過剰一般化でB。量的な言葉のすり替えに注意しましょう。</p>`
  },
  {
    id:'tama-v-x06', cat:'tama', topic:'趣旨判断（IMAGES形式）', diff:2, type:'mc',
    q:`次の文章で筆者が最も訴えたいこと（趣旨）に最も近いものを選べ。<br>
       <i>「便利な検索ツールのおかげで、私たちは知りたいことをすぐに調べられるようになった。だが、すぐに答えが手に入る環境は、自分の頭でじっくり考える機会を奪ってもいる。便利さの裏側にある代償にも目を向けるべきだ。」</i>`,
    choices:['検索ツールは使うべきではない','便利さには見落とされがちな代償があることに目を向けるべきだ','自分で考えるより検索した方が効率的だ','情報は多ければ多いほどよい'], answer:1,
    exp:`<p>IMAGES形式は<b>筆者の主張に最も近い選択肢</b>を1つ選びます。</p>
       <p>「だが…機会を奪ってもいる」「<b>代償にも目を向けるべきだ</b>」という逆接の後ろに筆者の力点があります。</p>
       <p>「使うべきでない」は言い過ぎ（筆者は便利さも認めている）、検索礼賛や情報量礼賛は筆者の懸念と逆。よって <b>便利さの代償に目を向けるべき</b>。</p>
       <p class="tip">▶ 「だが・しかし」の後＝主張、「べきだ」＝筆者の提言。前半の便利さの肯定に引っ張られて選ばないこと。</p>`
  },
  {
    id:'tama-v-x07', cat:'tama', topic:'趣旨判断（IMAGES形式）', diff:3, type:'mc',
    q:`次の文章で筆者が最も訴えたいこと（趣旨）に最も近いものを選べ。<br>
       <i>「失敗を避けようとするあまり、新しい挑戦を一切しない人がいる。確かに失敗は痛みを伴う。しかし、失敗から学べることは、成功からは決して得られないほど大きい。失敗を恐れずに挑戦する姿勢こそが、人を成長させるのだ。」</i>`,
    choices:['失敗は避けるべき痛みでしかない','失敗を恐れず挑戦する姿勢が人を成長させる','成功からしか学べることはない','挑戦せず安定を選ぶのが賢明だ'], answer:1,
    exp:`<p>「しかし、失敗から学べることは…大きい」「失敗を恐れずに挑戦する姿勢<b>こそ</b>が、人を成長させる」と、逆接と強調の語の後に主張があります。</p>
       <p>よって筆者の趣旨は <b>失敗を恐れず挑戦する姿勢が人を成長させる</b>。</p>
       <p>「失敗は痛みでしかない」「成功からしか学べない」「挑戦しないのが賢明」はいずれも筆者が否定している立場で不適。</p>
       <p class="tip">▶ 「こそ」は筆者が最も強調したい部分のサイン。逆接「しかし」とあわせて主張を特定します。</p>`
  },
  {
    id:'tama-v-x08', cat:'tama', topic:'英語（論理的読解）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is true, false, or cannot be determined.<br>
       <i>"The museum opened in 1985 and welcomes visitors every day except Mondays. Admission is free for children under the age of twelve."</i><br>
       <b>Statement: "The museum is closed on Mondays."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文に "welcomes visitors every day <b>except Mondays</b>"（月曜を除いて毎日来館者を迎える）とあります。月曜以外は開館＝<b>月曜は休館</b>です。</p>
       <p>設問「月曜は休館している」は本文から論理的に導けるので <b>True</b>。</p>
       <p class="tip">▶ "except"（〜を除いて）は重要キーワード。"every day except Mondays" は「月曜だけは開いていない」と論理的に判定できます。</p>`
  },
  {
    id:'tama-v-x09', cat:'tama', topic:'英語（論理的読解）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is true, false, or cannot be determined.<br>
       <i>"The museum opened in 1985 and welcomes visitors every day except Mondays. Admission is free for children under the age of twelve."</i><br>
       <b>Statement: "Adults must pay an admission fee."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:2,
    exp:`<p>本文は「12歳未満の子どもは入場無料」とだけ述べています。<b>大人の料金</b>については有料とも無料とも書かれていません。</p>
       <p>大人が料金を払う必要があるかは本文から判断できないので <b>Cannot say</b>。</p>
       <p class="tip">▶ "free for children under twelve" は子どもの話のみ。大人について書かれていない以上、推測でTrueにせずCannot sayを選びます。</p>`
  },
  {
    id:'tama-v-x10', cat:'tama', topic:'英語（論理的読解）', diff:3, type:'mc',
    q:`Read the passage and decide whether the statement is true, false, or cannot be determined.<br>
       <i>"All employees at this office start work at nine in the morning. Mr. Tanaka is an employee at this office."</i><br>
       <b>Statement: "Mr. Tanaka starts work at nine in the morning."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文は「このオフィスの<b>すべての従業員</b>は朝9時に仕事を始める」「田中氏はこのオフィスの従業員である」と述べています。</p>
       <p>すべての従業員が9時開始で、田中氏もその従業員なのだから、論理的に田中氏も9時開始です。よって <b>True</b>。</p>
       <p class="tip">▶ 「全員がXである」＋「Aはそのメンバーだ」→「AもXである」という三段論法はTrue。"all" を含む全称命題は論理的に導ける典型です。</p>`
  },
  {
    id:'tama-v-x11', cat:'tama', topic:'英語（長文読解）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Online courses allow students to learn at their own pace and from anywhere. However, they require strong self-discipline, as there is no teacher physically present to keep students on track."</i><br>
       <b>Question: According to the passage, what is a drawback of online courses?</b>`,
    choices:['Students cannot learn from home','They require strong self-discipline','They are more expensive than classrooms','They have no learning materials'], answer:1,
    exp:`<p>本文は "However, they <b>require strong self-discipline</b>"（しかし、強い自己管理を必要とする）と、オンライン講座の難点を述べています。</p>
       <p>よって欠点として挙げられているのは <b>強い自己管理力が必要なこと</b>。</p>
       <p>"learn from anywhere" とあるので「自宅で学べない」は逆。費用や教材については本文に記載なし。</p>
       <p class="tip">▶ "However" の後ろに筆者が指摘する難点（drawback）が来ます。設問が drawback を問うなら逆接の後を読むのが定石です。</p>`
  },
  {
    id:'tama-v-x12', cat:'tama', topic:'英語（長文読解）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"The report shows that the city's population grew steadily from 2010 to 2020. The main reason was an increase in young families moving into newly built residential areas near the station."</i><br>
       <b>Question: According to the passage, why did the city's population grow?</b>`,
    choices:['Because elderly people lived longer','Because young families moved into new residential areas','Because a new station was built','Because the birth rate suddenly doubled'], answer:1,
    exp:`<p>本文に "The main reason was an increase in <b>young families moving into newly built residential areas</b>"（主な理由は新築住宅地への若い家族の流入の増加）とあります。</p>
       <p>よって人口増加の理由は <b>若い家族が新しい住宅地に移り住んだこと</b>。</p>
       <p>駅は "near the station" と位置の説明に使われているだけで「新駅が建設された」とは書かれておらず、高齢者の長寿・出生率倍増も本文に記載なし。</p>
       <p class="tip">▶ "The main reason was 〜" は理由を直接示すキーセンテンス。設問が why（理由）なら、この型の文をまず探しましょう。</p>`
  }
);
