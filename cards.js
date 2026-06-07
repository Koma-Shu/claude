/* Shared playing-card library — deck logic + DOM card rendering + CSS.
   Used by all トランプ games in the arcade. */
(function(w){
  'use strict';

  const SUITS = ['S','H','D','C'];           // spade, heart, diamond, club
  const SUIT_CH = { S:'♠', H:'♥', D:'♦', C:'♣' };
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

  function isRed(suit){ return suit === 'H' || suit === 'D'; }

  // value: 1..13 (A=1). Each game can re-interpret as needed.
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

  // Build a DOM element for a card. faceUp=false → card back.
  function cardEl(card, faceUp){
    const el = document.createElement('div');
    el.className = 'pcard' + (faceUp === false ? ' back' : (isRed(card.suit) ? ' red' : ' black'));
    if (faceUp === false){
      el.innerHTML = '<div class="pc-back"></div>';
      return el;
    }
    const ch = SUIT_CH[card.suit];
    el.innerHTML =
      `<div class="pc-corner tl"><span class="pc-rank">${card.rank}</span><span class="pc-suit">${ch}</span></div>`+
      `<div class="pc-center">${ch}</div>`+
      `<div class="pc-corner br"><span class="pc-rank">${card.rank}</span><span class="pc-suit">${ch}</span></div>`;
    el.dataset.id = card.id;
    return el;
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
    `;
    document.head.appendChild(st);
  }
  injectCSS();

  w.CARDS = { SUITS, SUIT_CH, RANKS, isRed, makeDeck, shuffle, cardEl, injectCSS };
})(window);
