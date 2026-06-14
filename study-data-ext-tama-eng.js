/* study-data-ext-tama-eng.js — 玉手箱 英語 追加 */
(window.STUDY_DATA = window.STUDY_DATA || []).push(

// ════════════════════════════════════════════════════════════════════════
//  玉手箱 英語 (tama-eng) 追加 18問
//  GAB形式・英語 True/False/Cannot say (約11問) ＋ 長文読解 (約7問)
// ════════════════════════════════════════════════════════════════════════

  {
    id:'tama-eng-x01', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:1, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The company opened its first store in Tokyo in 1998. Within ten years it had expanded to more than fifty cities across Japan. In 2015 it opened its first overseas branch in Singapore."</i><br>
       <b>Statement: "The company's first overseas store was located in Singapore."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文に "In 2015 it opened its first overseas branch in Singapore."（2015年にシンガポールで初の海外支店を開いた）と明記されている。設問の "first overseas store was located in Singapore" は本文と一致する。</p>
       <p>よって <b>True</b>。</p>
       <p class="tip">▶ 本文中に "first ... overseas" がそのまま述べられている場合は True。言い換え（branch ↔ store）に惑わされず、事実が一致するかで判断する。</p>`
  },
  {
    id:'tama-eng-x02', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"All employees at the head office are required to attend the monthly safety meeting. Staff who work at the regional warehouses attend a separate session held every quarter."</i><br>
       <b>Statement: "Every head-office employee must attend a safety meeting once a month."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文に "All employees at the head office are required to attend the monthly safety meeting."（本社の全従業員は毎月の安全会議への出席が義務）とある。"All" と "monthly" から、本社従業員は全員、月1回出席が必須だと論理的に導ける。</p>
       <p>よって <b>True</b>。</p>
       <p class="tip">▶ "All / every" などの全称表現は、その範囲全員に当てはまることを示す。本文の "All employees" と設問の "Every employee" が同じ範囲を指すか確認しよう。</p>`
  },
  {
    id:'tama-eng-x03', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The museum is open every day except Mondays. On public holidays it operates on a reduced schedule, closing at 4 p.m. instead of the usual 6 p.m."</i><br>
       <b>Statement: "The museum is open on Mondays."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:1,
    exp:`<p>本文に "The museum is open every day except Mondays."（月曜以外は毎日開館）とある。"except Mondays" は月曜が休館であることを示すので、設問 "open on Mondays" は本文と矛盾する。</p>
       <p>よって <b>False</b>。</p>
       <p class="tip">▶ "except" は「～を除いて」。除外された対象は逆の扱いになる点が論理判定の鍵。every day except X → X だけは閉まっている。</p>`
  },
  {
    id:'tama-eng-x04', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The research team collected data from three cities: Osaka, Nagoya and Fukuoka. The results were published in an international journal in 2020."</i><br>
       <b>Statement: "The research team also collected data from Tokyo."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:1,
    exp:`<p>本文は "data from three cities: Osaka, Nagoya and Fukuoka"（3都市＝大阪・名古屋・福岡）と明示している。"three cities" と具体的な列挙により範囲が限定されているため、東京を含めると矛盾する。</p>
       <p>よって <b>False</b>。</p>
       <p class="tip">▶ "three cities" のように数や限定列挙があると範囲が閉じる。その範囲外の項目を加えた設問は False（追加情報がただ不明なだけの Cannot say とは区別する）。</p>`
  },
  {
    id:'tama-eng-x05', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:1, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The new bridge took four years to build and was completed in March. Local residents say it has greatly reduced their travel time to the city centre."</i><br>
       <b>Statement: "The bridge is the longest in the country."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:2,
    exp:`<p>本文は建設期間・完成時期・所要時間短縮について述べるが、橋の長さや国内での順位には一切触れていない。"the longest in the country" を支持も否定もできない。</p>
       <p>よって <b>Cannot say</b>。</p>
       <p class="tip">▶ 本文に書かれていない情報（ここでは長さ・全国比較）は True でも False でもなく Cannot say。常識で補ってはいけない。</p>`
  },
  {
    id:'tama-eng-x06', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:3, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"Only members who have paid the annual fee may borrow equipment from the club. Visitors are welcome to use the facilities but cannot take any equipment home."</i><br>
       <b>Statement: "A visitor who has not paid the annual fee can borrow equipment."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:1,
    exp:`<p>本文 "Only members who have paid the annual fee may borrow equipment."（年会費を払った会員のみ用具を借りられる）。"Only" により、それ以外（年会費未払いの来訪者）は借りられない。さらに "Visitors ... cannot take any equipment home." と裏付けられる。</p>
       <p>よって <b>False</b>。</p>
       <p class="tip">▶ "Only A may do X" は「Aだけが可能」＝A以外は不可、という排他を意味する。"only" は論理判定で頻出のキーワード。</p>`
  },
  {
    id:'tama-eng-x07', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The factory produces both electric and petrol-powered models. Last year, electric models accounted for 60 per cent of total output, the rest being petrol-powered."</i><br>
       <b>Statement: "Last year, petrol-powered models made up 40 per cent of total output."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文は電気が全体の60%で "the rest being petrol-powered"（残りがガソリン車）とある。製品は2種類のみなので、残り＝100−60＝40%。論理的に40%だと導ける。</p>
       <p>よって <b>True</b>。</p>
       <p class="tip">▶ 全体が2区分（both A and B）で一方の割合が示され "the rest" と言えば、もう一方は引き算で確定する。計算で論理判定できる典型。</p>`
  },
  {
    id:'tama-eng-x08', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:2, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The annual conference will be held in Kyoto this year. The organisers expect more participants than last year, when 800 people attended."</i><br>
       <b>Statement: "Exactly 900 people will attend the conference this year."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:2,
    exp:`<p>本文は「昨年は800人」「今年は昨年より多くなる見込み」と述べるだけで、今年の正確な人数は示されていない。900人という具体数は支持も否定もできない。</p>
       <p>よって <b>Cannot say</b>。</p>
       <p class="tip">▶ "more than last year" は「800人超」を示すが、それ以上の具体数は不明。"exactly 900" のような厳密な数値は本文から確定できなければ Cannot say。</p>`
  },
  {
    id:'tama-eng-x09', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:1, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"The library introduced a self-checkout system in April. Since then, the average waiting time at the counter has fallen by half."</i><br>
       <b>Statement: "Waiting time at the counter decreased after the self-checkout system was introduced."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文に "Since then, the average waiting time ... has fallen by half."（導入後、平均待ち時間が半減）とある。導入後に待ち時間が減ったという設問は本文と一致する。</p>
       <p>よって <b>True</b>。</p>
       <p class="tip">▶ "fallen by half"（半分に減った）は明確な減少。"decreased" と同義なので True。数値の言い換えに注意。</p>`
  },
  {
    id:'tama-eng-x10', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:3, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"All of the firm's senior managers studied abroad. Mr Tanaka is a senior manager at the firm."</i><br>
       <b>Statement: "Mr Tanaka studied abroad."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:0,
    exp:`<p>本文 "All of the firm's senior managers studied abroad."（全上級管理職は留学経験あり）かつ "Mr Tanaka is a senior manager"。三段論法により、田中氏も留学したと論理的に導ける。</p>
       <p>よって <b>True</b>。</p>
       <p class="tip">▶ 「全Aは B」＋「xはA」⇒「xはB」という三段論法。"All" の全称命題に個別事例を当てはめる定番パターン。</p>`
  },
  {
    id:'tama-eng-x11', cat:'tama-eng', topic:'論理的読解（GAB形式・英語）', diff:3, type:'mc',
    q:`Read the passage and decide whether the statement is True, False, or Cannot say from the text.<br>
       <i>"All of the firm's senior managers studied abroad. Ms Sato studied abroad."</i><br>
       <b>Statement: "Ms Sato is a senior manager at the firm."</b>`,
    choices:['True (logically follows)','False (contradicts the text)','Cannot say from the text'], answer:2,
    exp:`<p>本文は「全上級管理職は留学経験あり」と述べるが、これは「留学経験者は全員上級管理職」を意味しない（逆は必ずしも成り立たない）。佐藤氏が留学したからといって上級管理職とは限らないので、判定できない。</p>
       <p>よって <b>Cannot say</b>。</p>
       <p class="tip">▶ 「全AはB」から「BならばA」は導けない（逆は不成立）。x10と対になる典型的な論理の落とし穴。逆向きの推論には Cannot say。</p>`
  },
  {
    id:'tama-eng-x12', cat:'tama-eng', topic:'長文読解（主旨）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Remote work has changed the way many companies operate. While some managers worry about a loss of productivity, recent studies suggest that employees who work from home are often just as productive as, or even more productive than, those in the office. However, these same studies warn that long periods of isolation can harm team communication and weaken a sense of belonging. The challenge for companies, therefore, is to enjoy the benefits of remote work while keeping teams connected."</i><br>
       <b>Question: What is the main idea of the passage?</b>`,
    choices:[
      'Remote work always reduces employee productivity.',
      'Remote work can be productive but companies must address its effect on team connection.',
      'Managers should ban remote work to protect productivity.',
      'Employees prefer working in the office rather than at home.'],
    answer:1,
    exp:`<p>本文は、在宅勤務が生産性を保ち得る一方で、孤立がチームのコミュニケーションや帰属意識を損なうと述べ、最終文で「利点を享受しつつチームをつなぎ続けることが課題」とまとめている。主旨は選択肢2が正しい。</p>
       <p>・1: "always reduces productivity" は本文（同等以上に生産的）と矛盾。<br>
          ・3: 在宅禁止は本文の主張ではない。<br>
          ・4: オフィス志向の記述はない。</p>
       <p>よって <b>選択肢2</b>。</p>
       <p class="tip">▶ 主旨問題は最終文（結論）が手がかりになりやすい。"The challenge ... is to ..." が筆者の言いたいことを示す。</p>`
  },
  {
    id:'tama-eng-x13', cat:'tama-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"Honeybees communicate the location of food through a movement known as the 'waggle dance'. By changing the direction and duration of the dance, a bee can tell other bees both the direction of the food relative to the sun and how far away it is. This remarkable behaviour was first described in detail by the scientist Karl von Frisch, who later received a Nobel Prize for his work."</i><br>
       <b>Question: According to the passage, what does the duration of the waggle dance indicate?</b>`,
    choices:[
      'The colour of the flowers',
      'The distance to the food',
      'The number of bees in the hive',
      'The time of day'],
    answer:1,
    exp:`<p>本文に "By changing the direction and duration of the dance, a bee can tell ... how far away it is."（踊りの方向と長さで距離を伝える）とある。duration（長さ）は食料までの距離を示す。</p>
       <p>・direction は太陽に対する方向を示す（duration ではない）。色・蜂の数・時刻には言及がない。</p>
       <p>よって <b>選択肢2</b>。</p>
       <p class="tip">▶ 内容一致は本文の対応箇所を特定して読む。"direction → 方角" と "duration → 距離" の対応を取り違えないこと。</p>`
  },
  {
    id:'tama-eng-x14', cat:'tama-eng', topic:'長文読解（指示語）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"The city council approved a plan to plant ten thousand trees over the next five years. Supporters argue that this will improve air quality and provide shade during increasingly hot summers. Critics, however, point out that it will require significant funds for ongoing maintenance."</i><br>
       <b>Question: In the passage, what does the word "this" (in "this will improve air quality") refer to?</b>`,
    choices:[
      'The city council',
      'The plan to plant ten thousand trees',
      'The hot summers',
      'The significant funds'],
    answer:1,
    exp:`<p>"this will improve air quality and provide shade" の "this" は、直前文の "a plan to plant ten thousand trees"（1万本の植樹計画）を指す。植樹計画が大気質改善と日陰の提供につながる、という流れ。</p>
       <p>・council（議会）や hot summers、funds は文脈上 "this" の指示対象にならない。</p>
       <p>よって <b>選択肢2</b>。</p>
       <p class="tip">▶ 指示語問題は「直前の名詞句」を第一候補に、代入して意味が通るか確認。"this will improve air quality" に各候補を入れてみるとよい。</p>`
  },
  {
    id:'tama-eng-x15', cat:'tama-eng', topic:'長文読解（語彙 in context）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"When the factory first opened, output was modest, with only a few hundred units produced each month. Over the following decade, however, production grew rapidly, and the plant became one of the largest in the region."</i><br>
       <b>Question: In this context, the word "modest" most nearly means:</b>`,
    choices:['humble in personality','small in amount','expensive','well organised'],
    answer:1,
    exp:`<p>"output was modest, with only a few hundred units produced each month"（生産は modest で、月数百台のみ）という文脈。後半で "grew rapidly" と対比されることからも、modest は「（量が）少ない・控えめ」の意味。</p>
       <p>・"humble in personality"（謙虚な性格）は modest の別義だが、ここでは生産量を指すので不適。expensive・well organised は文意に合わない。</p>
       <p>よって <b>選択肢2 "small in amount"</b>。</p>
       <p class="tip">▶ 語彙 in context は多義語の「文脈に合う意味」を選ぶ。modest = 性格なら「謙虚」、量なら「少ない」。直後の "only a few hundred" が決め手。</p>`
  },
  {
    id:'tama-eng-x16', cat:'tama-eng', topic:'長文読解（内容一致）', diff:2, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"The survey was sent to two thousand customers, of whom about 35 per cent responded. Most of the respondents said they were satisfied with the product, but a notable number complained about the slow delivery service. In response, the company has promised to review its logistics partners."</i><br>
       <b>Question: Which of the following is true according to the passage?</b>`,
    choices:[
      'All two thousand customers replied to the survey.',
      'Most respondents were dissatisfied with the product itself.',
      'The company plans to review its logistics partners.',
      'The main complaint was about the product price.'],
    answer:2,
    exp:`<p>本文末に "the company has promised to review its logistics partners."（物流業者の見直しを約束）とある。選択肢3が一致。</p>
       <p>・1: 回答は約35%のみで全員ではない。<br>
          ・2: 多くは製品に "satisfied" で不満ではない。<br>
          ・4: 苦情は配送（slow delivery）であり価格ではない。</p>
       <p>よって <b>選択肢3</b>。</p>
       <p class="tip">▶ 内容一致問題は各選択肢を本文と一つずつ照合。数値(35%)や苦情の対象(delivery)など細部の言い換え・すり替えに注意。</p>`
  },
  {
    id:'tama-eng-x17', cat:'tama-eng', topic:'長文読解（主旨）', diff:3, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"For many years, scientists believed that the brain stopped developing in early adulthood. Newer research, however, has shown that the brain remains flexible throughout life, forming new connections in response to learning and experience. This ability, known as neuroplasticity, suggests that people can continue to acquire new skills well into old age."</i><br>
       <b>Question: What is the author's main point?</b>`,
    choices:[
      'The brain stops changing after early adulthood.',
      'Learning new skills is impossible for older people.',
      'The brain can keep changing and learning throughout life.',
      'Scientists no longer study the human brain.'],
    answer:2,
    exp:`<p>本文は「以前は脳が成人初期で発達を止めると考えられていたが、新しい研究で脳は生涯柔軟で新たな接続を作る（neuroplasticity）と示された」と述べ、高齢でも新スキル習得が可能と結論づけている。主旨は選択肢3。</p>
       <p>・1: これは旧来の見解で本文が否定する内容。<br>
          ・2: 本文は逆に「習得できる」と述べる。<br>
          ・4: 研究をやめたとは述べていない。</p>
       <p>よって <b>選択肢3</b>。</p>
       <p class="tip">▶ "however" の後ろに筆者の主張が来ることが多い。旧説（before）と新説（however以降）を区別し、筆者が支持する側を選ぶ。</p>`
  },
  {
    id:'tama-eng-x18', cat:'tama-eng', topic:'長文読解（内容一致）', diff:1, type:'mc',
    q:`Read the passage and answer the question.<br>
       <i>"The train service between the two cities runs every thirty minutes during the day. In the early morning and late evening, however, trains run only once an hour. Tickets can be bought at the station or in advance through the official app."</i><br>
       <b>Question: How often do trains run during the day?</b>`,
    choices:[
      'Once an hour',
      'Every thirty minutes',
      'Every fifteen minutes',
      'Only in the early morning'],
    answer:1,
    exp:`<p>本文に "The train service ... runs every thirty minutes during the day."（日中は30分ごと）と明記されている。選択肢2が正しい。</p>
       <p>・"Once an hour" は早朝・深夜のみの運行頻度であり、日中ではない。15分ごとや早朝限定は本文にない。</p>
       <p>よって <b>選択肢2</b>。</p>
       <p class="tip">▶ 時間帯ごとに条件が異なる文では「いつの話か」を取り違えないこと。設問の "during the day" に対応する箇所だけを読む。</p>`
  }

);
