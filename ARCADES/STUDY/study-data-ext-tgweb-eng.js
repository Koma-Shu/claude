/* study-data-ext-tgweb-eng.js — TG-WEB 英語 追加 */
(window.STUDY_DATA = window.STUDY_DATA || []).push(

// ════════════════════════════════════════════════════════════════════════
//  TG-WEB 英語 (tgweb-eng) 追加 25問
//  長文読解中心：主旨 / 内容一致 / 推論 / 指示語 / 語彙 / 空所補充 / 語句整序
// ════════════════════════════════════════════════════════════════════════

  // ── 本文A：環境（プラスチック汚染）x01-x02 ──
  {
    id:'tgweb-eng-x01', cat:'tgweb-eng', topic:'長文読解（主旨）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Microplastics—tiny fragments less than five millimetres across—now turn up almost everywhere scientists look, from deep-sea sediments to mountain snow. Although the long-term effects on human health remain uncertain, researchers warn that the sheer scale of contamination makes the problem impossible to ignore. Reducing the production of single-use plastics, they argue, is far more effective than trying to clean up particles once they have dispersed into the environment."</i><br>
       <b>Question: What is the main idea of the passage?</b>`,
    choices:[
      'Microplastics have already been proven to cause serious diseases in humans.',
      'Because microplastics are so widespread, preventing plastic use matters more than cleanup.',
      'Cleaning up microplastics from the oceans is now both cheap and simple.',
      'Microplastics are found only in remote regions far from human activity.'
    ], answer:1,
    exp:`<p>本文は「マイクロプラスチックが至る所に存在し（"now turn up almost everywhere"）、汚染の規模が無視できない」と述べたうえで、"Reducing the production of single-use plastics ... is far more effective than trying to clean up"（使い捨てプラスチックの生産削減のほうが、拡散後の除去より効果的）と主張している。これが主旨。</p>
       <p>(1)は "long-term effects ... remain uncertain"（健康影響は不確実）と矛盾、(3)は本文と逆、(4)は "almost everywhere" と矛盾。よって正解は <b>(2)</b>。</p>
       <p class="tip">▶ 主旨問題は筆者の主張（しばしば they argue / researchers warn など）に注目。本文全体を一文でまとめた選択肢を選ぶ。</p>`
  },
  {
    id:'tgweb-eng-x02', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Microplastics—tiny fragments less than five millimetres across—now turn up almost everywhere scientists look, from deep-sea sediments to mountain snow. Although the long-term effects on human health remain uncertain, researchers warn that the sheer scale of contamination makes the problem impossible to ignore. Reducing the production of single-use plastics, they argue, is far more effective than trying to clean up particles once they have dispersed into the environment."</i><br>
       <b>Question: Which statement is supported by the passage?</b>`,
    choices:[
      'The health effects of microplastics on humans are not yet fully understood.',
      'Microplastics are defined as fragments larger than five millimetres.',
      'Scientists have failed to detect microplastics in mountain snow.',
      'Most researchers believe cleanup is the only realistic solution.'
    ], answer:0,
    exp:`<p>本文に "the long-term effects on human health remain uncertain"（人体への長期的影響は不確実なまま）とあり、(1)「健康影響はまだ十分に解明されていない」が一致する。</p>
       <p>(2)は "less than five millimetres"（5mm未満）と逆、(3)は "from ... mountain snow"（山の雪からも検出）と矛盾、(4)は生産削減のほうが効果的という主張と矛盾。よって <b>(1)</b>。</p>
       <p class="tip">▶ 内容一致は本文の言い換えを探す。"remain uncertain" ↔ "not yet fully understood" のようなパラフレーズに気づこう。</p>`
  },

  // ── 本文B：科学（睡眠と記憶）x03-x05 ──
  {
    id:'tgweb-eng-x03', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"During sleep, the brain does not simply shut down. Instead, it replays the day's experiences, strengthening the neural connections that underlie memory. This process, known as consolidation, helps transfer information from short-term storage to more durable long-term memory. Studies show that people who sleep after learning a new skill perform it more accurately than those who stay awake for the same period."</i><br>
       <b>Question: According to the passage, what happens to memories during sleep?</b>`,
    choices:[
      'They are erased to make room for new information.',
      'They are moved from short-term storage toward long-term memory.',
      'They remain completely unchanged until morning.',
      'They are weakened so that the brain can rest.'
    ], answer:1,
    exp:`<p>本文に "helps transfer information from short-term storage to more durable long-term memory"（短期記憶からより持続的な長期記憶へ情報を移すのを助ける）とある。(2)がこれに一致する。</p>
       <p>(1)(4)は記憶を「強化する（strengthening）」という記述と矛盾、(3)は "replays ... strengthening" と矛盾。よって <b>(2)</b>。</p>
       <p class="tip">▶ detail問題は該当箇所をピンポイントで探す。本文 transfer ... to long-term memory が答えの根拠。</p>`
  },
  {
    id:'tgweb-eng-x04', cat:'tgweb-eng', topic:'長文読解（推論）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"During sleep, the brain does not simply shut down. Instead, it replays the day's experiences, strengthening the neural connections that underlie memory. This process, known as consolidation, helps transfer information from short-term storage to more durable long-term memory. Studies show that people who sleep after learning a new skill perform it more accurately than those who stay awake for the same period."</i><br>
       <b>Question: What can be inferred from the passage?</b>`,
    choices:[
      'Staying awake all night is the best way to master a new skill.',
      'Sleeping after practice may improve how well a skill is learned.',
      'Memory consolidation only occurs in people who never sleep.',
      'The brain is completely inactive while a person sleeps.'
    ], answer:1,
    exp:`<p>本文は「学習後に睡眠をとった人は、起きていた人より正確にスキルを行える」と述べている。ここから「練習後に眠ることでスキルの定着が向上しうる」と推論できる。(2)が妥当。</p>
       <p>(1)は本文と逆、(3)は consolidation は睡眠中に起こるので矛盾、(4)は "does not simply shut down" と矛盾。よって <b>(2)</b>。</p>
       <p class="tip">▶ 推論問題は本文に直接書いていなくても、本文の事実から論理的に導ける選択肢を選ぶ。言い過ぎ（best, only, completely）は誤りのことが多い。</p>`
  },
  {
    id:'tgweb-eng-x05', cat:'tgweb-eng', topic:'長文読解（語彙）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"During sleep, the brain does not simply shut down. Instead, it replays the day's experiences, strengthening the neural connections that underlie memory. This process, known as consolidation, helps transfer information from short-term storage to more durable long-term memory."</i><br>
       <b>Question: In this context, the word "durable" is closest in meaning to:</b>`,
    choices:['temporary','long-lasting','fragile','expensive'], answer:1,
    exp:`<p>"durable" は「長持ちする、耐久性のある」の意味。本文では "more durable long-term memory"（より持続的な長期記憶）として、短期記憶と対比されている。"long-lasting"（長く続く）が最も近い。</p>
       <p>"temporary"（一時的）と "fragile"（壊れやすい）は逆の意味、"expensive"（高価）は無関係。よって <b>(2)</b>。</p>
       <p class="tip">▶ vocabulary in context は文脈での意味を問う。前後の対比（short-term ↔ long-term）から語の意味を絞り込む。</p>`
  },

  // ── 本文C：ビジネス（リモートワーク）x06-x08 ──
  {
    id:'tgweb-eng-x06', cat:'tgweb-eng', topic:'長文読解（主旨）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"When many companies shifted to remote work, managers feared that productivity would collapse. In practice, the opposite often happened: freed from long commutes and frequent interruptions, employees frequently reported getting more done. Yet the change came at a cost. Casual conversations that once sparked new ideas became rare, and some workers felt increasingly isolated from their colleagues."</i><br>
       <b>Question: What is the main point of the passage?</b>`,
    choices:[
      'Remote work destroyed productivity at almost every company.',
      'Remote work brought clear gains in output but also notable drawbacks.',
      'Long commutes are the single greatest cause of low productivity.',
      'Casual conversations among colleagues are completely worthless.'
    ], answer:1,
    exp:`<p>本文は前半で「生産性はむしろ上がることが多かった」（more done）、後半で "Yet the change came at a cost"（だが代償も伴った：アイデアの偶発的交流の減少、孤立）と述べる。利点と欠点の両面を指摘しているので(2)が主旨。</p>
       <p>(1)は本文と逆、(3)(4)は一部だけを誇張。よって <b>(2)</b>。</p>
       <p class="tip">▶ "Yet / However / but" の後に筆者の力点が来ることが多い。利点と欠点の両方に触れた選択肢を選ぶ。</p>`
  },
  {
    id:'tgweb-eng-x07', cat:'tgweb-eng', topic:'長文読解（指示語）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"When many companies shifted to remote work, managers feared that productivity would collapse. In practice, the opposite often happened: freed from long commutes and frequent interruptions, employees frequently reported getting more done. Yet the change came at a cost."</i><br>
       <b>Question: What does "the opposite" refer to in the passage?</b>`,
    choices:[
      'Productivity rising rather than collapsing',
      'Companies returning to the office',
      'Managers losing their jobs',
      'Commutes becoming longer than before'
    ], answer:0,
    exp:`<p>直前で managers は "productivity would collapse"（生産性が崩壊する）と恐れていた。"the opposite often happened" はその反対、すなわち「生産性が崩壊せず、むしろ上がった」ことを指す。直後の "getting more done" もこれを裏づける。(1)が正解。</p>
       <p>よって <b>(1)</b>。</p>
       <p class="tip">▶ 指示語（it / this / the opposite など）は直前の文を確認する。"the opposite of X" は X の逆を指す。</p>`
  },
  {
    id:'tgweb-eng-x08', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:1, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"When many companies shifted to remote work, managers feared that productivity would collapse. In practice, the opposite often happened: freed from long commutes and frequent interruptions, employees frequently reported getting more done. Yet the change came at a cost. Casual conversations that once sparked new ideas became rare, and some workers felt increasingly isolated from their colleagues."</i><br>
       <b>Question: Which is mentioned as a drawback of remote work?</b>`,
    choices:[
      'Employees had to commute even longer distances.',
      'Some workers felt isolated from their colleagues.',
      'Companies were forced to hire many new managers.',
      'Productivity collapsed exactly as managers had feared.'
    ], answer:1,
    exp:`<p>本文の最後に "some workers felt increasingly isolated from their colleagues"（一部の労働者は同僚から孤立を感じた）とあり、これが欠点として明記されている。(2)が一致。</p>
       <p>(1)は "freed from long commutes" と矛盾、(3)は記述なし、(4)は "the opposite often happened" と矛盾。よって <b>(2)</b>。</p>
       <p class="tip">▶ detail問題は本文に直接書かれた語句を探す。isolated from their colleagues がそのまま根拠。</p>`
  },

  // ── 本文D：社会（都市の緑地）x09-x11 ──
  {
    id:'tgweb-eng-x09', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Urban parks do more than provide a pleasant place to relax. Trees and grass lower surrounding temperatures by providing shade and releasing moisture into the air, an effect that can make a city noticeably cooler during heat waves. Green spaces also absorb rainwater that would otherwise overwhelm drainage systems, reducing the risk of flooding after heavy storms."</i><br>
       <b>Question: According to the passage, how do urban parks affect city temperatures?</b>`,
    choices:[
      'They raise temperatures by trapping heat among the trees.',
      'They lower temperatures through shade and moisture release.',
      'They have no measurable effect on temperature at all.',
      'They cool the city only during the winter months.'
    ], answer:1,
    exp:`<p>本文に "Trees and grass lower surrounding temperatures by providing shade and releasing moisture into the air"（木や草は日陰を作り空気中に水分を放出して周囲の気温を下げる）とある。(2)が一致する。</p>
       <p>(1)は "lower" と逆、(3)は "noticeably cooler" と矛盾、(4)は "during heat waves"（猛暑時）と矛盾。よって <b>(2)</b>。</p>
       <p class="tip">▶ how 〜 の設問は手段・仕組みを問う。by providing shade and releasing moisture が根拠。</p>`
  },
  {
    id:'tgweb-eng-x10', cat:'tgweb-eng', topic:'長文読解（指示語）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Green spaces also absorb rainwater that would otherwise overwhelm drainage systems, reducing the risk of flooding after heavy storms. Without this capacity, water rushes across paved surfaces and collects rapidly in low-lying streets."</i><br>
       <b>Question: What does "this capacity" refer to?</b>`,
    choices:[
      'The ability of green spaces to absorb rainwater',
      'The tendency of streets to flood quickly',
      'The risk of damage to drainage systems',
      'The speed at which storms arrive in a city'
    ], answer:0,
    exp:`<p>直前の文で「緑地は雨水を吸収し、洪水リスクを減らす」と述べている。"this capacity"（この能力）はその「雨水を吸収する緑地の能力」を指す。"Without this capacity"（この能力がなければ水が舗装面を流れる）という続きとも整合する。(1)が正解。</p>
       <p>よって <b>(1)</b>。</p>
       <p class="tip">▶ "this + 名詞" は直前で述べた行為・性質を要約して指すことが多い。直前の動詞句（absorb rainwater）に対応させる。</p>`
  },
  {
    id:'tgweb-eng-x11', cat:'tgweb-eng', topic:'長文読解（推論）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Urban parks do more than provide a pleasant place to relax. Trees and grass lower surrounding temperatures, and green spaces absorb rainwater that would otherwise overwhelm drainage systems, reducing the risk of flooding after heavy storms."</i><br>
       <b>Question: What can be inferred about a city with very few green spaces?</b>`,
    choices:[
      'It would likely be cooler and less prone to flooding.',
      'It would likely be hotter and more prone to flooding.',
      'It would have no parks for residents to relax in, but the same temperature.',
      'It would experience fewer heat waves than a greener city.'
    ], answer:1,
    exp:`<p>本文は緑地が「気温を下げ、洪水リスクを減らす」と述べている。よって緑地が非常に少ない都市では、その逆で「より暑く、より洪水になりやすい」と推論できる。(2)が妥当。</p>
       <p>(1)は逆、(3)は気温への影響を無視、(4)も本文の論理と逆。よって <b>(2)</b>。</p>
       <p class="tip">▶ 「Xが効果Yをもたらす」なら「Xがなければ効果Yも得られない（逆の状態）」と推論するのが定石。</p>`
  },

  // ── 本文E：科学（蜂と農業）x12-x13 ──
  {
    id:'tgweb-eng-x12', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Bees are among the most important pollinators on the planet. As they move from flower to flower in search of nectar, they carry pollen with them, allowing plants to reproduce. A large share of the crops that humans rely on for food depend on this service. For that reason, the recent decline in bee populations has alarmed farmers and scientists alike."</i><br>
       <b>Question: Why has the decline in bee populations alarmed people?</b>`,
    choices:[
      'Because bees produce most of the honey sold in stores',
      'Because many food crops depend on bees for pollination',
      'Because bees are the only insects that can fly long distances',
      'Because bees compete with farmers for nectar'
    ], answer:1,
    exp:`<p>本文に "A large share of the crops that humans rely on for food depend on this service"（人間が食料として頼る作物の多くがこの受粉に依存）とあり、続けて "For that reason, the recent decline ... has alarmed"（そのため減少が懸念されている）と理由が示される。(2)が一致。</p>
       <p>(1)の蜂蜜は本文に記述なし、(3)(4)も根拠なし。よって <b>(2)</b>。</p>
       <p class="tip">▶ Why 〜 の設問は "For that reason / because" などの因果表現を手がかりに根拠文を探す。</p>`
  },
  {
    id:'tgweb-eng-x13', cat:'tgweb-eng', topic:'長文読解（語彙）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Bees are among the most important pollinators on the planet. As they move from flower to flower in search of nectar, they carry pollen with them, allowing plants to reproduce."</i><br>
       <b>Question: In this context, the word "reproduce" is closest in meaning to:</b>`,
    choices:['copy a document','produce offspring','play a sound again','reduce in size'], answer:1,
    exp:`<p>本文の "reproduce" は植物が花粉によって「繁殖する・子孫を残す」こと。"allowing plants to reproduce"（植物が繁殖できるようにする）の文脈に合うのは "produce offspring"（子孫を生む）。</p>
       <p>"copy a document"（複写する）や "play a sound again"（再生する）は別の語義、"reduce in size"（縮小）は無関係。よって <b>(2)</b>。</p>
       <p class="tip">▶ reproduce は「複製する」「繁殖する」など複数義を持つ多義語。生物・植物の文脈では「繁殖する」。</p>`
  },

  // ── 本文F：社会（言語の消滅）x14-x15 ──
  {
    id:'tgweb-eng-x14', cat:'tgweb-eng', topic:'長文読解（主旨）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Linguists estimate that a language dies somewhere in the world roughly every two weeks. When the last fluent speaker passes away, more than words are lost: a unique way of describing the world, along with stories, songs, and knowledge passed down over generations, disappears with them. Efforts to record and teach endangered languages, therefore, are not merely academic exercises but attempts to preserve part of humanity's shared heritage."</i><br>
       <b>Question: What is the author's main argument?</b>`,
    choices:[
      'Languages should be allowed to disappear naturally without interference.',
      'Preserving endangered languages protects valuable human knowledge and culture.',
      'Only written languages are worth recording for future study.',
      'A new language is created somewhere in the world every two weeks.'
    ], answer:1,
    exp:`<p>本文は「言語が消えると、世界の捉え方や物語・歌・知識が失われる」と述べ、"Efforts to record and teach endangered languages ... are ... attempts to preserve part of humanity's shared heritage"（消滅危機言語の記録・教育は人類共有の遺産を守る試み）と結論づける。(2)が主旨。</p>
       <p>(1)は本文の主張と逆、(3)は本文になく songs/stories（口承）も重視、(4)は "a language dies"（消える）の誤読。よって <b>(2)</b>。</p>
       <p class="tip">▶ 主旨は "therefore / not merely A but B" の B 側に筆者の力点。本文の結論文を要約した選択肢を選ぶ。</p>`
  },
  {
    id:'tgweb-eng-x15', cat:'tgweb-eng', topic:'長文読解（推論）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"When the last fluent speaker passes away, more than words are lost: a unique way of describing the world, along with stories, songs, and knowledge passed down over generations, disappears with them."</i><br>
       <b>Question: What does the author imply by saying "more than words are lost"?</b>`,
    choices:[
      'Only the vocabulary of the language is forgotten.',
      'A language carries cultural knowledge beyond its mere words.',
      'Lost words can always be recovered from dictionaries.',
      'Speakers deliberately choose to forget their language.'
    ], answer:1,
    exp:`<p>"more than words are lost" の後に "a unique way of describing the world, along with stories, songs, and knowledge" が続く。つまり「言葉そのもの以上に、文化・知識が失われる」と示唆している。(2)が正解。</p>
       <p>(1)は "more than words" と矛盾、(3)(4)は本文に根拠なし。よって <b>(2)</b>。</p>
       <p class="tip">▶ "more than X" は「X だけでなく、それ以上のもの」を含意する。続く具体例が答えのヒント。</p>`
  },

  // ── 本文G：ビジネス（電気自動車）x16-x17 ──
  {
    id:'tgweb-eng-x16', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Sales of electric vehicles have risen sharply in recent years, driven by falling battery prices and stricter emissions regulations. Still, several obstacles stand in the way of wider adoption. In many regions, charging stations remain scarce, and the time needed to recharge a battery is far longer than the few minutes required to fill a tank with petrol."</i><br>
       <b>Question: According to the passage, which is an obstacle to wider adoption of electric vehicles?</b>`,
    choices:[
      'Battery prices have been rising sharply.',
      'Charging stations are scarce in many regions.',
      'Emissions regulations have become much weaker.',
      'Recharging a battery is faster than refuelling with petrol.'
    ], answer:1,
    exp:`<p>本文に "charging stations remain scarce"（充電ステーションが少ないまま）とあり、これが普及の障害として挙げられている。(2)が一致。</p>
       <p>(1)は "falling battery prices"（価格は下落）と逆、(3)は "stricter emissions regulations"（規制は厳格化）と逆、(4)は充電時間が "far longer"（はるかに長い）と矛盾。よって <b>(2)</b>。</p>
       <p class="tip">▶ "Still / however / obstacles" の後に問題点が列挙される。scarce, longer などのマイナス語に注目。</p>`
  },
  {
    id:'tgweb-eng-x17', cat:'tgweb-eng', topic:'長文読解（語彙）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Still, several obstacles stand in the way of wider adoption. In many regions, charging stations remain scarce, and the time needed to recharge a battery is far longer than the few minutes required to fill a tank with petrol."</i><br>
       <b>Question: In this context, the word "scarce" is closest in meaning to:</b>`,
    choices:['plentiful','in short supply','expensive','crowded'], answer:1,
    exp:`<p>"scarce" は「乏しい、不足している」の意味。本文では充電ステーションが「障害（obstacle）」として "remain scarce" と述べられており、不足の文脈に合う。"in short supply"（供給が不足している）が最も近い。</p>
       <p>"plentiful"（豊富）は逆、"expensive"（高価）や "crowded"（混雑）は文脈外。よって <b>(2)</b>。</p>
       <p class="tip">▶ scarce は rare に近く「数が少ない」。obstacle の文脈なので「不足している」という否定的な意味になる。</p>`
  },

  // ── 本文H：科学（深海探査）x18-x19 ──
  {
    id:'tgweb-eng-x18', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"The deep ocean remains one of the least explored places on Earth. Crushing pressure, total darkness, and freezing temperatures make it extremely difficult to reach. As a result, scientists believe that countless species living there have yet to be discovered, and each new expedition tends to bring back creatures unlike anything seen before."</i><br>
       <b>Question: Why is the deep ocean difficult to explore?</b>`,
    choices:[
      'Because it is too brightly lit for cameras to function',
      'Because of crushing pressure, darkness, and freezing temperatures',
      'Because no unknown species could possibly live there',
      'Because expeditions there are forbidden by law'
    ], answer:1,
    exp:`<p>本文に "Crushing pressure, total darkness, and freezing temperatures make it extremely difficult to reach"（押しつぶす水圧・完全な暗闇・凍てつく低温が到達を困難にする）とある。(2)が一致。</p>
       <p>(1)は "total darkness"（暗闇）と逆、(3)は "species ... yet to be discovered" と矛盾、(4)は記述なし。よって <b>(2)</b>。</p>
       <p class="tip">▶ Why 〜 difficult の設問は困難の原因を列挙した箇所を探す。三つの要因がそのまま根拠。</p>`
  },
  {
    id:'tgweb-eng-x19', cat:'tgweb-eng', topic:'長文読解（推論）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"As a result, scientists believe that countless species living there have yet to be discovered, and each new expedition tends to bring back creatures unlike anything seen before."</i><br>
       <b>Question: What can be inferred about future deep-sea expeditions?</b>`,
    choices:[
      'They are unlikely to find any new forms of life.',
      'They will probably continue to discover previously unknown species.',
      'They have already catalogued every deep-sea creature.',
      'They will focus only on species that are already well known.'
    ], answer:1,
    exp:`<p>本文は「未発見の種が無数にあり、新たな探査のたびに見たことのない生物を持ち帰る傾向がある」と述べる。ここから「今後の探査も未知の種を発見し続けるだろう」と推論できる。(2)が妥当。</p>
       <p>(1)(3)(4)はいずれも本文の「未発見の種が無数にある」という記述と矛盾。よって <b>(2)</b>。</p>
       <p class="tip">▶ "tends to bring back creatures unlike anything seen before"（毎回新種を持ち帰る傾向）から、未来も同様と推論する。</p>`
  },

  // ── 本文I：社会（フェイクニュース）x20-x21 ──
  {
    id:'tgweb-eng-x20', cat:'tgweb-eng', topic:'長文読解（主旨）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"False information can now travel around the globe in seconds, often spreading faster than careful corrections can follow. Studies suggest that striking but inaccurate stories are shared more widely than dull but truthful ones, because they provoke stronger emotions. The most reliable defence, experts say, is not censorship but education: teaching people to question sources and check claims before passing them on."</i><br>
       <b>Question: What does the author suggest is the best defence against false information?</b>`,
    choices:[
      'Strict government censorship of all online content',
      'Teaching people to question sources and verify claims',
      'Sharing only stories that provoke strong emotions',
      'Banning the use of the internet entirely'
    ], answer:1,
    exp:`<p>本文末に "The most reliable defence ... is not censorship but education: teaching people to question sources and check claims"（最も信頼できる防御は検閲ではなく教育＝情報源を疑い主張を確認させること）とある。(2)が主旨。</p>
       <p>(1)は "not censorship" と明確に否定、(3)は誤情報拡散の原因であって防御ではない、(4)は本文になし。よって <b>(2)</b>。</p>
       <p class="tip">▶ "not A but B"（AではなくB）の構文では B が筆者の主張。education がキーワード。</p>`
  },
  {
    id:'tgweb-eng-x21', cat:'tgweb-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Studies suggest that striking but inaccurate stories are shared more widely than dull but truthful ones, because they provoke stronger emotions."</i><br>
       <b>Question: According to the passage, why are inaccurate stories shared more widely?</b>`,
    choices:[
      'Because they are easier to fact-check',
      'Because they provoke stronger emotions',
      'Because they are always longer than true stories',
      'Because governments require people to share them'
    ], answer:1,
    exp:`<p>本文に "because they provoke stronger emotions"（より強い感情を引き起こすから）と理由が明示されている。(2)が一致。</p>
       <p>(1)(3)(4)はいずれも本文に根拠がない。よって <b>(2)</b>。</p>
       <p class="tip">▶ because 以下に理由がそのまま書かれている。設問の why と本文の because を直結させる。</p>`
  },

  // ── 空所補充 x22-x23 ──
  {
    id:'tgweb-eng-x22', cat:'tgweb-eng', topic:'空所補充', diff:2, type:'mc',
    q:`Read the passage and choose the best word to fill in the blank.<br>
       <i>"The new policy was intended to reduce traffic in the city centre. (&nbsp;&nbsp;&nbsp;&nbsp;), it had the opposite effect: as drivers searched for free parking on side streets, congestion actually increased."</i><br>
       <b>Question: Which word best fits the blank?</b>`,
    choices:['Therefore','However','For example','In addition'], answer:1,
    exp:`<p>空所の前は「政策は渋滞を減らす意図だった」、後は "it had the opposite effect"（逆の効果だった）。前後が逆接の関係なので、逆接の接続副詞 "However"（しかしながら）が適切。</p>
       <p>"Therefore"（だから）や "In addition"（さらに）は順接・追加、"For example"（例えば）は例示で文脈に合わない。よって <b>(2)</b>。</p>
       <p class="tip">▶ 空所補充は前後の論理関係を見る。意図と結果が「逆」なら逆接 However / Yet / Nevertheless。</p>`
  },
  {
    id:'tgweb-eng-x23', cat:'tgweb-eng', topic:'空所補充', diff:2, type:'mc',
    q:`Read the passage and choose the best word to fill in the blank.<br>
       <i>"Regular exercise offers many benefits. It strengthens the heart, improves mood, and helps maintain a healthy weight. (&nbsp;&nbsp;&nbsp;&nbsp;), it can reduce the risk of several chronic diseases, such as diabetes."</i><br>
       <b>Question: Which word best fits the blank?</b>`,
    choices:['Nevertheless','Moreover','In contrast','Otherwise'], answer:1,
    exp:`<p>空所の前で運動の利点が列挙され、後でも「慢性疾患のリスク低減」という別の利点が追加されている。利点を追加する関係なので "Moreover"（さらに）が適切。</p>
       <p>"Nevertheless"（それにもかかわらず）と "In contrast"（対照的に）は逆接、"Otherwise"（さもなければ）は条件で不適。よって <b>(2)</b>。</p>
       <p class="tip">▶ 同じ方向の内容を付け足すなら追加の Moreover / Furthermore / In addition。</p>`
  },

  // ── 語句整序 x24-x25 ──
  {
    id:'tgweb-eng-x24', cat:'tgweb-eng', topic:'語句整序', diff:2, type:'mc',
    q:`Arrange the words to form a grammatically correct and meaningful sentence.<br>
       <b>[ been / has / English / spoken / widely ] around the world.</b><br>
       <b>Question: Which is the correct order?</b>`,
    choices:[
      'English has been widely spoken around the world.',
      'English has widely been spoken around the world.',
      'English been has spoken widely around the world.',
      'Has English been spoken widely around the world.'
    ], answer:0,
    exp:`<p>現在完了の受動態は「have/has + been + 過去分詞」。主語 English に対し "has been spoken"（話されてきた）となり、頻度を表す副詞 widely は過去分詞の前に置くのが自然で、"has been widely spoken" が標準的な語順。(1)が正しい。</p>
       <p>(2)は副詞位置がやや不自然、(3)は語順が崩れ非文、(4)は平叙文なのに疑問文語順で不適。よって <b>(1)</b>。</p>
       <p class="tip">▶ 現在完了受動態の型は has been + 過去分詞。頻度副詞（widely 等）は been と過去分詞の間が定位置。</p>`
  },
  {
    id:'tgweb-eng-x25', cat:'tgweb-eng', topic:'語句整序', diff:3, type:'mc',
    q:`Arrange the words to form a grammatically correct and meaningful sentence.<br>
       <b>She is the [ author / book / changed / whose / my life ].</b><br>
       <b>Question: Which is the correct order?</b>`,
    choices:[
      'author whose book changed my life',
      'author book whose changed my life',
      'whose author book changed my life',
      'author whose changed book my life'
    ], answer:0,
    exp:`<p>所有格の関係代名詞 whose は「whose + 名詞」の形で続く。ここでは "the author whose book changed my life"（その本が私の人生を変えた著者）となり、whose book（彼女の本）が主語、changed が動詞。(1)が正しい語順。</p>
       <p>(2)(3)(4)はいずれも whose の直後に名詞 book が来ておらず、構造が崩れる。よって <b>(1)</b>。</p>
       <p class="tip">▶ whose は直後に必ず名詞を伴い「whose + 名詞」で一つの主語/目的語を作る。whose book changed ... の語順を押さえる。</p>`
  }

);
