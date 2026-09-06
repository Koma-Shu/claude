/* study-data-ext-spi.js — SPI 英語 + 言語 追加 */
(window.STUDY_DATA = window.STUDY_DATA || []).push(

// ════════════════════════════════════════════════════════════════════════
//  SPI 英語 (spi-eng) 20問
// ════════════════════════════════════════════════════════════════════════
  { id:'spi-eng-x01', cat:'spi-eng', topic:'同意語(synonym)', diff:1, type:'mc',
    q:`Choose the word closest in meaning to the underlined word.<br>He was very <u>diligent</u> in his work.`,
    choices:['hardworking','careless','tired','honest'], answer:0,
    exp:`<p><b>diligent</b>＝勤勉な、よく働く。よって <b>hardworking</b>（勤勉な）が同義です。</p>
       <p>・careless（不注意な）／・tired（疲れた）／・honest（正直な）はいずれも意味が異なります。</p>
       <p class="tip">▶ 語尾 -ent / -ant の形容詞は人の性質を表すことが多い。diligent と関連語の diligence（勤勉さ）もセットで覚えましょう。</p>` },

  { id:'spi-eng-x02', cat:'spi-eng', topic:'同意語(synonym)', diff:2, type:'mc',
    q:`Choose the word closest in meaning to the underlined word.<br>The results of the survey were quite <u>significant</u>.`,
    choices:['trivial','important','strange','obvious'], answer:1,
    exp:`<p><b>significant</b>＝重要な、意味のある。よって <b>important</b> が最も近い意味です。</p>
       <p>・trivial（ささいな）は反対の意味／・strange（奇妙な）・obvious（明らかな）は別の概念です。</p>
       <p class="tip">▶ significant は「重要な」のほか「（統計的に）有意な」の意味でも頻出。語幹 sign（しるし）＝「意味のある」と覚えると忘れにくい。</p>` },

  { id:'spi-eng-x03', cat:'spi-eng', topic:'同意語(synonym)', diff:2, type:'mc',
    q:`Choose the word closest in meaning to the underlined word.<br>She gave a <u>brief</u> explanation of the plan.`,
    choices:['detailed','short','boring','clear'], answer:1,
    exp:`<p><b>brief</b>＝短い、簡潔な。よって <b>short</b> が同義です。</p>
       <p>・detailed（詳細な）は反対／・boring（退屈な）・clear（明確な）は意味が違います。</p>
       <p class="tip">▶ 名詞 brief は「概要・指示書」、副詞 briefly は「手短に」。"to be brief"（手短に言えば）も頻出表現です。</p>` },

  { id:'spi-eng-x04', cat:'spi-eng', topic:'反意語(antonym)', diff:1, type:'mc',
    q:`Choose the word that is most nearly <b>opposite</b> in meaning to the underlined word.<br>The instructions were very <u>complex</u>.`,
    choices:['difficult','simple','long','useful'], answer:1,
    exp:`<p><b>complex</b>＝複雑な。その反対は <b>simple</b>（単純な、簡単な）です。</p>
       <p>・difficult（難しい）は似た意味で反対ではない／・long（長い）・useful（役立つ）は無関係です。</p>
       <p class="tip">▶ 反意語問題は「似た意味の語」を選ばせるひっかけに注意。complex と difficult は近いが、求めるのは正反対の simple です。</p>` },

  { id:'spi-eng-x05', cat:'spi-eng', topic:'反意語(antonym)', diff:2, type:'mc',
    q:`Choose the word that is most nearly <b>opposite</b> in meaning to the underlined word.<br>His attitude toward the project was <u>positive</u>.`,
    choices:['active','negative','serious','honest'], answer:1,
    exp:`<p><b>positive</b>＝肯定的な、前向きな。その反対は <b>negative</b>（否定的な、消極的な）です。</p>
       <p>・active（積極的な）はむしろ近い／・serious（真剣な）・honest（正直な）は別概念です。</p>
       <p class="tip">▶ positive ⇔ negative は最頻出ペア。optimistic（楽観的）⇔ pessimistic（悲観的）も合わせて覚えましょう。</p>` },

  { id:'spi-eng-x06', cat:'spi-eng', topic:'反意語(antonym)', diff:2, type:'mc',
    q:`Choose the word that is most nearly <b>opposite</b> in meaning to the underlined word.<br>The amount of food was <u>abundant</u>.`,
    choices:['plentiful','scarce','fresh','cheap'], answer:1,
    exp:`<p><b>abundant</b>＝豊富な、たくさんある。その反対は <b>scarce</b>（乏しい、不足した）です。</p>
       <p>・plentiful（豊富な）は同義語なので不可／・fresh（新鮮な）・cheap（安い）は無関係です。</p>
       <p class="tip">▶ abundant の名詞は abundance（豊富）。scarce の名詞 scarcity（不足）と対で押さえておくと語彙が広がります。</p>` },

  { id:'spi-eng-x07', cat:'spi-eng', topic:'語彙の意味', diff:2, type:'mc',
    q:`Choose the answer that best explains the meaning of the underlined word.<br>The new policy will <u>encourage</u> employees to study English.`,
    choices:['force','inspire and support','prevent','ignore'], answer:1,
    exp:`<p><b>encourage</b>＝励ます、促す、後押しする。よって <b>inspire and support</b>（鼓舞し支援する）が意味として最も近い。</p>
       <p>・force（強制する）は意味が強すぎる／・prevent（妨げる）は反対／・ignore（無視する）は無関係です。</p>
       <p class="tip">▶ "encourage 人 to do"（人が〜するよう促す）の語法が重要。反意語は discourage（思いとどまらせる）です。</p>` },

  { id:'spi-eng-x08', cat:'spi-eng', topic:'語彙の意味', diff:3, type:'mc',
    q:`Choose the answer that best explains the meaning of the underlined word.<br>The two countries reached an <u>agreement</u> after long talks.`,
    choices:['a serious argument','a shared decision','a new war','a delay'], answer:1,
    exp:`<p><b>agreement</b>＝合意、協定、意見の一致。よって <b>a shared decision</b>（共有された決定）が意味に最も近い。</p>
       <p>・a serious argument（激しい口論）は反対のニュアンス／・a new war（新たな戦争）・a delay（遅延）は無関係です。</p>
       <p class="tip">▶ 動詞 agree、形容詞 agreeable と同語源。"reach an agreement"（合意に達する）はビジネス英語の定番表現です。</p>` },

  { id:'spi-eng-x09', cat:'spi-eng', topic:'文法・語法（前置詞）', diff:1, type:'mc',
    q:`Choose the word that best completes the sentence.<br>I have been waiting (&nbsp;&nbsp;) you for an hour.`,
    choices:['for','to','of','at'], answer:0,
    exp:`<p>動詞 <b>wait</b> は「〜を待つ」を表すとき前置詞 <b>for</b> を伴い、"wait for 人/物" となります。</p>
       <p>・to / of / at はこの語法では使いません。</p>
       <p class="tip">▶ 前置詞とセットで覚える動詞：wait for（待つ）／look for（探す）／apply for（応募する）。丸ごと暗記が得点源です。</p>` },

  { id:'spi-eng-x10', cat:'spi-eng', topic:'文法・語法（前置詞）', diff:2, type:'mc',
    q:`Choose the word that best completes the sentence.<br>She is good (&nbsp;&nbsp;) playing the piano.`,
    choices:['in','at','on','with'], answer:1,
    exp:`<p>「〜が得意だ」は <b>be good at +名詞/動名詞</b> で表します。よって <b>at</b> が正解です。</p>
       <p>・in / on / with はこの慣用表現では使いません。</p>
       <p class="tip">▶ at は「一点」を指すイメージ。good at（得意）／bad at（苦手）／expert at（熟練した）の形で覚えましょう。</p>` },

  { id:'spi-eng-x11', cat:'spi-eng', topic:'文法・語法（時制）', diff:2, type:'mc',
    q:`Choose the word or phrase that best completes the sentence.<br>When I arrived at the station, the train had already (&nbsp;&nbsp;).`,
    choices:['leave','left','leaving','leaves'], answer:1,
    exp:`<p>「私が着いたとき、列車はすでに出発してしまっていた」という<b>過去完了</b>（過去のある時点より前に完了した動作）の文です。had + 過去分詞 の形にするため、leave の過去分詞 <b>left</b> が正解です。</p>
       <p>・leave（原形）／・leaving（-ing形）／・leaves（三単現）はいずれも had の後に続けられません。</p>
       <p class="tip">▶ 「過去のある時点」より前のことは過去完了 had + 過去分詞。already / just / never などの副詞を伴うことが多いです。</p>` },

  { id:'spi-eng-x12', cat:'spi-eng', topic:'文法・語法（語順）', diff:2, type:'mc',
    q:`Choose the answer that puts the words in the correct order.<br>Do you know (&nbsp;&nbsp;)?`,
    choices:['where is the post office','where the post office is','is where the post office','the post office where is'], answer:1,
    exp:`<p>疑問詞 where が文の一部に組み込まれた<b>間接疑問文</b>です。間接疑問では語順が<b>「疑問詞＋主語＋動詞」</b>となり、平叙文の語順になります。よって <b>where the post office is</b> が正解です。</p>
       <p>・where is the post office は通常の疑問文の語順なので不可です。</p>
       <p class="tip">▶ 間接疑問文は「疑問詞＋主語＋動詞」。"Tell me what you want."（何が欲しいか教えて）のように動詞の後でも同じ語順です。</p>` },

  { id:'spi-eng-x13', cat:'spi-eng', topic:'空所補充', diff:1, type:'mc',
    q:`Choose the word that best completes the sentence.<br>Although it was raining, they (&nbsp;&nbsp;) to go out.`,
    choices:['decided','decide','deciding','decision'], answer:0,
    exp:`<p>文全体は過去のことを述べており（it was raining）、主節の動詞も過去形にします。"decide to do"（〜することに決める）の形で、過去形 <b>decided</b> が正解です。</p>
       <p>・decide（原形）／・deciding（-ing形）／・decision（名詞）は文の動詞になれません。</p>
       <p class="tip">▶ Although（〜だけれども）は譲歩の接続詞。前後の節で時制をそろえることが空所補充のポイントです。</p>` },

  { id:'spi-eng-x14', cat:'spi-eng', topic:'空所補充（接続詞）', diff:2, type:'mc',
    q:`Choose the word that best completes the sentence.<br>You should take an umbrella (&nbsp;&nbsp;) it rains later.`,
    choices:['in case','so that','as if','even though'], answer:0,
    exp:`<p>「後で雨が降るといけないので傘を持って行くべきだ」という意味です。「〜するといけないから、〜に備えて」は <b>in case</b> で表します。</p>
       <p>・so that（〜するために）／・as if（まるで〜のように）／・even though（〜だけれども）はいずれも文意に合いません。</p>
       <p class="tip">▶ in case は「万一に備えて」。接続詞問題は前後の論理関係（理由・目的・譲歩・条件）を見極めるのが鍵です。</p>` },

  { id:'spi-eng-x15', cat:'spi-eng', topic:'語句整序', diff:3, type:'mc',
    q:`Put the words in the correct order to make a sentence, then choose the word that comes <b>third</b>.<br>[ to / it / important / is / read ] books.`,
    choices:['important','to','is','read'], answer:0,
    exp:`<p>正しい文は <i>"It is important to read books."</i>（本を読むことは大切だ）です。形式主語 It ＋ be動詞 ＋ 形容詞 ＋ to不定詞 の構文になります。</p>
       <p>並びは It(1) → is(2) → important(3) → to(4) → read(5)。よって<b>3番目</b>は <b>important</b> です。</p>
       <p class="tip">▶ "It is +形容詞+ to do"（〜することは…だ）は最重要構文。It は形式主語で、本当の主語は to read books です。</p>` },

  { id:'spi-eng-x16', cat:'spi-eng', topic:'長文読解（主旨）', diff:2, type:'mc',
    q:`Read the passage and choose the best answer.<br><i>"Many people think that working long hours leads to better results. However, recent studies show that taking regular breaks actually improves both concentration and productivity."</i><br>What is the main idea of this passage?`,
    choices:['Working long hours is always the best way to succeed.','Taking regular breaks can improve productivity.','Studies are usually wrong about work.','People should never take breaks at work.'], answer:1,
    exp:`<p>本文は「長時間労働が良い結果を生むと多くの人は考えるが、近年の研究では<b>定期的な休憩が集中力と生産性を高める</b>と示している」と述べています。However 以降が筆者の主張（主旨）です。</p>
       <p>よって <b>Taking regular breaks can improve productivity.</b> が主旨に合致します。</p>
       <p class="tip">▶ 主旨問題は However / But などの逆接の後に筆者の言いたいことが来ることが多い。冒頭の通説ではなく転換後の主張に注目しましょう。</p>` },

  { id:'spi-eng-x17', cat:'spi-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and choose the answer that agrees with it.<br><i>"The museum is open from Tuesday to Sunday. It is closed on Mondays. Admission is free for children under twelve, but adults must pay 500 yen."</i><br>Which statement agrees with the passage?`,
    choices:['The museum is open every day.','Children under twelve can enter for free.','Adults can enter for free.','The museum is closed on Sundays.'], answer:1,
    exp:`<p>本文より、12歳未満の子どもは入館無料（free for children under twelve）と書かれています。よって <b>Children under twelve can enter for free.</b> が内容に一致します。</p>
       <p>・月曜は休館なので「毎日開いている」は誤り／・大人は500円なので「無料」は誤り／・日曜は開館（Tuesday to Sunday）なので誤りです。</p>
       <p class="tip">▶ 内容一致は本文の数字や曜日などの具体情報と選択肢を一つずつ照合。言い換え（free＝無料）に惑わされず事実関係を確認しましょう。</p>` },

  { id:'spi-eng-x18', cat:'spi-eng', topic:'長文読解（指示語）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br><i>"Tom bought a new smartphone last week. He uses it mainly to take photos of his trips."</i><br>What does the word <u>"it"</u> refer to?`,
    choices:['a new smartphone','last week','his trips','Tom'], answer:0,
    exp:`<p>第2文の "He uses <u>it</u> mainly to take photos" の it は、直前の文で出た目的語（物）を指します。文脈上、写真を撮るのに使う物は <b>a new smartphone</b>（新しいスマートフォン）です。</p>
       <p>・last week（時）／・his trips（旅行）／・Tom（人）は「使う物」を表せません。</p>
       <p class="tip">▶ 指示語 it / they / this は原則として直前の名詞を指す。代入して意味が通るか（it＝smartphone）で確認するのが確実です。</p>` },

  { id:'spi-eng-x19', cat:'spi-eng', topic:'長文読解（推論）', diff:3, type:'mc',
    q:`Read the passage and choose the best inference.<br><i>"When Lisa opened the door, she found water all over the kitchen floor. The pipe under the sink was making a strange noise."</i><br>What can be inferred from the passage?`,
    choices:['Lisa was cooking dinner.','The pipe under the sink was probably broken or leaking.','Lisa cleaned the kitchen yesterday.','The kitchen was completely dry.'], answer:1,
    exp:`<p>床一面に水があり（water all over the floor）、流しの下のパイプが変な音を立てていた（making a strange noise）という記述から、<b>パイプが壊れて水漏れしていた</b>と推論するのが最も自然です。</p>
       <p>・料理をしていた、昨日掃除した、台所が乾いていた、はいずれも本文の手がかりからは導けません（最後の選択肢は本文と矛盾）。</p>
       <p class="tip">▶ 推論問題は本文に直接書かれていなくても、記述された事実から論理的に最もありそうな結論を選ぶ。飛躍しすぎる選択肢は避けましょう。</p>` },

  { id:'spi-eng-x20', cat:'spi-eng', topic:'同意語(synonym)', diff:3, type:'mc',
    q:`Choose the word closest in meaning to the underlined word.<br>The manager decided to <u>postpone</u> the meeting until next week.`,
    choices:['cancel','delay','start','attend'], answer:1,
    exp:`<p><b>postpone</b>＝（予定を）延期する。よって <b>delay</b>（遅らせる、延期する）が最も近い意味です。</p>
       <p>・cancel（中止する）は「取りやめる」で延期とは異なる／・start（始める）・attend（出席する）は無関係です。</p>
       <p class="tip">▶ postpone（延期）と cancel（中止）の違いは頻出。"put off" も postpone と同義の句動詞として覚えておきましょう。</p>` },

// ════════════════════════════════════════════════════════════════════════
//  SPI 言語 (spi-verb) 8問
// ════════════════════════════════════════════════════════════════════════
  { id:'spi-verb-n01', cat:'spi-verb', topic:'二語の関係（役割）', diff:2, type:'mc',
    q:`最初に示した二語と同じ関係になる組み合わせを選べ。<br><b>体温計：温度</b>`,
    choices:['ものさし：長さ','地図：道路','カメラ：写真','黒板：教室'], answer:0,
    exp:`<p>「体温計：温度」は <b>計測器：それで測る量</b> の関係です。体温計は温度を測る道具です。</p>
       <p>・<b>ものさし：長さ → 計測器：測る量</b> ✓（ものさしは長さを測る）<br>
          ・地図：道路 → 表すもの：内容（測る関係ではない）<br>
          ・カメラ：写真 → 道具：作り出す成果物<br>
          ・黒板：教室 → もの：置かれる場所</p>
       <p>よって <b>ものさし：長さ</b>。</p>
       <p class="tip">▶ 二語の関係は「Aは（Bを）○○する道具だ」と文にして関係を言語化。"測る"対象が二つ目に来るかを確認しましょう。</p>` },

  { id:'spi-verb-n02', cat:'spi-verb', topic:'語句の意味', diff:2, type:'mc',
    q:`「<b>潔い（いさぎよい）</b>」の意味として最も適切なものを選べ。`,
    choices:['思い切りがよく未練がましくない','体や場所が清潔である','行動がとても素早い','人当たりが柔らかい'], answer:0,
    exp:`<p><b>潔い</b>＝態度がさっぱりしていて、<b>思い切りがよく未練がましくない</b>さまを表します。「潔く負けを認める」のように使います。</p>
       <p>「清潔（きれい）」と漢字が似ていますが意味は異なり、性格・態度についての語です。</p>
       <p>よって <b>思い切りがよく未練がましくない</b>。</p>
       <p class="tip">▶ 語句の意味問題は、その語を使った短い例文（潔く謝る＝未練なくきっぱり）を思い浮かべると正答しやすいです。</p>` },

  { id:'spi-verb-n03', cat:'spi-verb', topic:'文の並べ替え', diff:2, type:'mc',
    q:`次のア〜エを意味が通るように並べ替えたとき、正しい順序はどれか。<br>
       ア そこで、毎朝十分間だけ机に向かうことにした。<br>
       イ 私は長い間、日記を続けられずにいた。<br>
       ウ 短い時間なら無理なく続けられたからだ。<br>
       エ すると、半年たっても日記は途切れていない。`,
    choices:['イ→ア→エ→ウ','イ→ウ→ア→エ','ア→イ→ウ→エ','イ→ア→ウ→エ'], answer:0,
    exp:`<p>まず話の前提となる「課題」を述べ、次に「対策」、その「結果」、最後に「理由（補足）」と並ぶと自然です。</p>
       <p>イ（続けられなかった）→ ア（そこで毎朝十分だけにした）→ エ（すると途切れていない）→ ウ（短い時間なら続けられたからだ）。</p>
       <p>接続語「そこで（＝だから）」「すると」「〜からだ（理由）」が順序の手がかりです。よって <b>イ→ア→エ→ウ</b>。</p>
       <p class="tip">▶ 並べ替えは①指示語・接続語を手がかりにする②話の流れ（課題→対策→結果→理由）を意識する、の二点が決め手です。</p>` },

  { id:'spi-verb-n04', cat:'spi-verb', topic:'空欄補充（接続詞）', diff:1, type:'mc',
    q:`文意が通るように空欄に入る語を選べ。<br>「彼は朝早くから練習を重ねた。（&nbsp;&nbsp;）、本番では実力を出し切れなかった。」`,
    choices:['だから','しかし','つまり','さらに'], answer:1,
    exp:`<p>前半「練習を重ねた」と後半「実力を出せなかった」は<b>期待と反する内容</b>です。逆接の接続詞 <b>しかし</b> が適切です。</p>
       <p>・だから（順接）／・つまり（言い換え）／・さらに（添加）はいずれも前後の逆接関係に合いません。</p>
       <p>よって <b>しかし</b>。</p>
       <p class="tip">▶ 接続詞補充は前後の論理関係を判定：順接（だから）・逆接（しかし）・並列添加（さらに）・換言（つまり）・対比（一方）。</p>` },

  { id:'spi-verb-n05', cat:'spi-verb', topic:'長文読解（趣旨）', diff:3, type:'mc',
    q:`次の文章の趣旨として最も適切なものを選べ。<br>「読書の価値は、得た知識の量だけでは測れない。むしろ、一冊の本をきっかけに、自分の頭で問い直し、考えを深めていく過程にこそ意味がある。」`,
    choices:['読書では多くの本を読むことが何より大切だ','読書の意義は知識量よりも考えを深める過程にある','読書は知識を得るためには役に立たない','本は一冊だけ読めば十分である'], answer:1,
    exp:`<p>筆者は「知識の量だけでは測れない」「（むしろ）考えを深めていく過程にこそ意味がある」と述べています。<b>むしろ</b>の後が主張の中心です。</p>
       <p>よって趣旨は <b>読書の意義は知識量よりも考えを深める過程にある</b>。</p>
       <p>・「多くの本を読むことが大切」「役に立たない」「一冊で十分」はいずれも本文の主張とずれています。</p>
       <p class="tip">▶ 趣旨は「むしろ」「〜こそ」など強調表現の後に筆者の主張が来ることが多い。極端な言い切り（〜ない／〜だけ）の選択肢は要注意です。</p>` },

  { id:'spi-verb-n06', cat:'spi-verb', topic:'熟語の成り立ち', diff:2, type:'mc',
    q:`「<b>握手</b>」と同じ成り立ち（構成）の熟語を選べ。`,
    choices:['寒冷','着席','高低','岩石'], answer:1,
    exp:`<p>「握手」＝手を握る、で <b>「動詞＋目的語（〜を〜する）」</b>の構成です。下の字が上の字の目的語になります。</p>
       <p>・寒冷 → 寒い・冷たい（似た意味の字）<br>
          ・<b>着席 → 席に着く（動詞＋目的語）</b> ✓<br>
          ・高低 → 高い⇔低い（反対の意味の字）<br>
          ・岩石 → 岩・石（似た意味の字）</p>
       <p>よって <b>着席</b>。</p>
       <p class="tip">▶ 「下の字→上の字」と返って「〜を／〜に〜する」と読めれば動詞＋目的語型（握手＝手を握る、着席＝席に着く）。</p>` },

  { id:'spi-verb-n07', cat:'spi-verb', topic:'ことわざ・慣用句', diff:2, type:'mc',
    q:`「<b>気が置けない</b>」の意味として最も適切なものを選べ。`,
    choices:['遠慮がいらず打ち解けられる','油断できず気を許せない','落ち着きがなく不安定だ','とても怒りっぽい'], answer:0,
    exp:`<p><b>気が置けない</b>＝遠慮や気遣いがいらず、<b>打ち解けて付き合える</b>という意味です。「気が置けない友人」は気楽に付き合える友人を指します。</p>
       <p>「油断できない」という<b>逆の意味で誤用</b>されやすい代表例です。本来は良い意味で使います。</p>
       <p>よって <b>遠慮がいらず打ち解けられる</b>。</p>
       <p class="tip">▶ 誤用に注意する慣用句：気が置けない（＝遠慮いらず）／煮詰まる（＝結論が近い）／檄を飛ばす（＝意見を広く知らせる）。本来の意味で覚えましょう。</p>` },

  { id:'spi-verb-n08', cat:'spi-verb', topic:'敬語', diff:3, type:'mc',
    q:`お客様に対する言い方として<b>最も適切な敬語</b>を選べ。<br>「（あなたは）何時に（来ますか）」と尋ねたい。`,
    choices:['何時に参りますか','何時にいらっしゃいますか','何時に伺いますか','何時にお越しになられますか'], answer:1,
    exp:`<p>相手（お客様）の動作なので<b>尊敬語</b>を使います。「来る」の尊敬語は <b>いらっしゃる／お越しになる</b> です。</p>
       <p>・参る → <b>謙譲語</b>（自分が行く・来る）なので相手には使えない（×）<br>
          ・伺う → <b>謙譲語</b>（自分が訪問する）なので不可（×）<br>
          ・お越しになられる → 尊敬語「お越しになる」＋「られる」で<b>二重敬語</b>の誤り（×）</p>
       <p>よって <b>「何時にいらっしゃいますか」</b>。</p>
       <p class="tip">▶ 「来る」の尊敬語＝いらっしゃる／お越しになる、謙譲語＝参る／伺う。相手の動作には尊敬語を使い、二重敬語を避けるのが要点です。</p>` }

);
