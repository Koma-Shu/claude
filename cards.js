/* Shared playing-card library — deck logic + DOM card rendering + CSS + animations */
(function(w){
  'use strict';

  const SUITS = ['S','H','D','C'];
  const SUIT_CH = { S:'♠', H:'♥', D:'♦', C:'♣' };
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

  function isRed(suit){ return suit === 'H' || suit === 'D'; }

  function makeDeck(){
    const d = [];
    for (const s of SUITS)
      for (let i = 0; i < RANKS.length; i++)
        d.push({ suit:s, rank:RANKS[i], value:i+1, id:s+RANKS[i] });
    return d;
  }

  function shuffle(a){
    for (let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _faceHTML(card){
    if (card.joker){
      return `<div class="pc-corner tl"><span class="pc-rank" style="font-size:.55rem">JOKER</span></div>`+
        `<div class="pc-center">🃏</div>`+
        `<div class="pc-corner br"><span class="pc-rank" style="font-size:.55rem">JOKER</span></div>`;
    }
    const ch = SUIT_CH[card.suit];
    return `<div class="pc-corner tl"><span class="pc-rank">${card.rank}</span><span class="pc-suit">${ch}</span></div>`+
      `<div class="pc-center">${ch}</div>`+
      `<div class="pc-corner br"><span class="pc-rank">${card.rank}</span><span class="pc-suit">${ch}</span></div>`;
  }

  function cardEl(card, faceUp){
    const el = document.createElement('div');
    const colorCls = card.joker ? ' black' : (isRed(card.suit) ? ' red' : ' black');
    el.className = 'pcard' + (faceUp === false ? ' back' : colorCls);
    if (faceUp === false){
      el.innerHTML = '<div class="pc-back"></div>';
    } else {
      el.innerHTML = _faceHTML(card);
      el.dataset.id = card.id;
    }
    return el;
  }

  // ── Animations ────────────────────────────────────────────────────

  // Flip a face-down card to face-up with a 3-D Y-axis spin.
  // el must currently be a back-face card element in the DOM.
  function flipCard(el, card, onDone){
    el.style.transition = 'transform 0.13s ease-in';
    el.style.transform  = 'perspective(500px) rotateY(90deg)';
    setTimeout(() => {
      el.className   = 'pcard ' + (card.joker ? 'black' : (isRed(card.suit) ? 'red' : 'black'));
      el.innerHTML   = _faceHTML(card);
      el.dataset.id  = card.id;
      el.style.transition = 'transform 0.13s ease-out';
      el.style.transform  = 'perspective(500px) rotateY(0deg)';
      setTimeout(() => {
        el.style.transform  = '';
        el.style.transition = '';
        if (onDone) onDone();
      }, 140);
    }, 140);
  }

  // Slide a card in from above.  Call AFTER appending to the DOM.
  // delay (ms) before animation starts; onDone fires when slide completes.
  function dealIn(el, delay, onDone){
    el.style.opacity   = '0';
    el.style.transform = 'translateY(-40px) scale(0.82)';
    el.style.transition = 'none';
    const go = () => {
      el.style.transition = 'transform 0.22s cubic-bezier(.22,.8,.36,1), opacity 0.18s ease';
      el.style.transform  = '';
      el.style.opacity    = '1';
      if (onDone) setTimeout(onDone, 230);
    };
    if (delay) setTimeout(go, delay);
    else requestAnimationFrame(() => requestAnimationFrame(go));
  }

  // Shrink + fade a card, then remove it from the DOM.
  function exitCard(el, onDone){
    el.style.transition = 'transform 0.22s ease-in, opacity 0.22s ease-in';
    el.style.transform  = 'scale(0.2) rotateY(90deg)';
    el.style.opacity    = '0';
    el.style.pointerEvents = 'none';
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (onDone) onDone();
    }, 240);
  }

  // Show a brief centred overlay (e.g. "PAIR ✨") over the page.
  // cards: array of card objects to display face-up; duration in ms.
  function showOverlay(titleText, cards_, titleColor, duration, onDone){
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;'+
      'justify-content:center;background:rgba(0,0,0,.78);z-index:200;gap:16px;';

    const h = document.createElement('div');
    h.style.cssText = `font-size:1.6rem;font-weight:bold;letter-spacing:2px;color:${titleColor||'#fff'};`;
    h.textContent = titleText;

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:14px;';
    cards_.forEach(c => {
      const el = cardEl(c, true);
      el.style.setProperty('--cw','72px');
      el.style.setProperty('--ch','100px');
      row.appendChild(el);
    });

    ov.appendChild(h);
    ov.appendChild(row);
    document.body.appendChild(ov);

    const dismiss = () => {
      ov.style.transition = 'opacity 0.3s';
      ov.style.opacity = '0';
      setTimeout(() => { if (ov.parentNode) document.body.removeChild(ov); if (onDone) onDone(); }, 310);
    };
    ov.onclick = dismiss;       // tap to dismiss early
    setTimeout(dismiss, duration || 1400);
  }

  // Inject shared card CSS once.
  function injectCSS(){
    if (document.getElementById('cards-css')) return;
    const st = document.createElement('style');
    st.id = 'cards-css';
    st.textContent = `
    .pcard{position:relative;width:var(--cw,64px);height:var(--ch,90px);
      border-radius:7px;background:#fff;border:1px solid #cbd2dc;
      box-shadow:0 2px 5px rgba(0,0,0,.35);user-select:none;
      font-family:'Arial','Helvetica',sans-serif;flex:0 0 auto;
      transition:transform .12s,box-shadow .12s;}
    .pcard.red{color:#d4243a;} .pcard.black{color:#1a1a2a;}
    .pcard .pc-corner{position:absolute;display:flex;flex-direction:column;
      align-items:center;line-height:1;}
    .pcard .pc-corner.tl{top:4px;left:5px;}
    .pcard .pc-corner.br{bottom:4px;right:5px;transform:rotate(180deg);}
    .pcard .pc-rank{font-size:calc(var(--cw,64px)*0.26);font-weight:bold;}
    .pcard .pc-suit{font-size:calc(var(--cw,64px)*0.22);}
    .pcard .pc-center{position:absolute;inset:0;display:flex;align-items:center;
      justify-content:center;font-size:calc(var(--cw,64px)*0.5);opacity:.92;}
    .pcard.back{background:linear-gradient(135deg,#1e3a8a,#3b1d6e);border-color:#11204d;}
    .pcard.back .pc-back{position:absolute;inset:5px;border-radius:4px;
      background:repeating-linear-gradient(45deg,#2748b0 0 6px,#1b3486 6px 12px);
      border:1px solid rgba(255,255,255,.18);}
    .pcard.sel{transform:translateY(-16px);box-shadow:0 8px 16px rgba(0,0,0,.5);}
    .pcard.playable{cursor:pointer;}
    .pcard.playable:hover{transform:translateY(-10px);box-shadow:0 8px 16px rgba(0,0,0,.5);}
    .pcard.dim{opacity:.45;filter:grayscale(.4);}
    .pcard.glow-gold{box-shadow:0 0 0 3px #ffe27a,0 0 14px 4px rgba(255,226,122,.7)!important;}
    .pcard.glow-green{box-shadow:0 0 0 3px #7dffb0,0 0 14px 4px rgba(125,255,176,.7)!important;}
    .pcard.new-card{outline:3px solid #ffe27a;outline-offset:2px;}
    @keyframes _shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}
      40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
    .pcard.shake{animation:_shake 0.38s ease;}
    `;
    document.head.appendChild(st);
  }
  injectCSS();

  // Flip a face-up card back to face-down.
  function flipBack(el, onDone){
    el.style.transition = 'transform 0.13s ease-in';
    el.style.transform  = 'perspective(500px) rotateY(90deg)';
    setTimeout(() => {
      el.className   = 'pcard back';
      el.innerHTML   = '<div class="pc-back"></div>';
      el.dataset.id  = '';
      el.style.transition = 'transform 0.13s ease-out';
      el.style.transform  = 'perspective(500px) rotateY(0deg)';
      setTimeout(() => {
        el.style.transform  = '';
        el.style.transition = '';
        if (onDone) onDone();
      }, 140);
    }, 140);
  }

  w.CARDS = { SUITS, SUIT_CH, RANKS, isRed, makeDeck, shuffle,
               cardEl, flipCard, flipBack, dealIn, exitCard, showOverlay, injectCSS };
})(window);
