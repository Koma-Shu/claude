/* ARCADE Sound System — procedural BGM + SFX via Web Audio API */
(function(w) {
  'use strict';

  let _ctx = null, _master = null;
  let _muted = localStorage.getItem('snd_muted') === '1';
  let _bgmRunning = false, _bgmTimer = null, _bgmTheme = 'title';

  const N = {
    C3:130.8,D3:146.8,E3:164.8,F3:174.6,G3:196,A3:220,B3:246.9,
    C4:261.6,D4:293.7,E4:329.6,F4:349.2,G4:392,A4:440,B4:493.9,
    C5:523.3,D5:587.3,E5:659.3,F5:698.5,G5:784,A5:880,B5:987.8,
    r:0
  };

  function _ac() {
    if (!_ctx) {
      try {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
        _master = _ctx.createGain();
        _master.gain.value = _muted ? 0 : 0.55;
        _master.connect(_ctx.destination);
      } catch(e) { return null; }
    }
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  function _osc(freq, t0, dur, type, vol, atk, rel) {
    const c = _ac(); if (!c || !freq) return;
    const osc = c.createOscillator();
    const g   = c.createGain();
    osc.connect(g); g.connect(_master);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + atk);
    g.gain.setValueAtTime(vol, Math.max(t0 + atk + 0.001, t0 + dur - rel));
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  function _b(f,t,d,type='square',v=0.18,a=0.005,r=0.04){_osc(f,t,d,type,v,a,r);}

  const sfx = {
    place() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(N.D5,t,.09,'triangle',.22,.004,.04);
      _b(N.G5,t+.04,.06,'triangle',.1,.003,.04);
    },
    move() {
      const c=_ac();if(!c)return;
      _b(N.A4,c.currentTime,.07,'sine',.18,.004,.04);
    },
    capture() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(N.A3,t,.07,'sawtooth',.28,.003,.05);
      _b(N.E3,t+.06,.12,'sawtooth',.2,.003,.06);
    },
    promote() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [N.E5,N.G5,N.B5].forEach((f,i)=>_b(f,t+i*.09,.14,'square',.2,.005,.05));
    },
    win() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      const tune=[N.C5,N.E5,N.G5,N.C5*2,N.E5*2];
      tune.forEach((f,i)=>_b(f,t+i*.11,.18,'square',.22,.006,.06));
      _b(N.C3,t,.55,'triangle',.15,.01,.1);
    },
    lose() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [380,300,230,175].forEach((f,i)=>_b(f,t+i*.13,.22,'sawtooth',.22,.005,.08));
    },
    click() {
      const c=_ac();if(!c)return;
      _b(N.B5,c.currentTime,.04,'sine',.12,.002,.03);
    },
    flip() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(N.G4,t,.06,'triangle',.18,.003,.04);
      _b(N.D5,t+.04,.08,'triangle',.14,.003,.04);
    },
    check() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(440,t,.04,'sawtooth',.25,.002,.03);
      _b(550,t+.05,.07,'sawtooth',.2,.003,.04);
    },
    invalid() {
      const c=_ac();if(!c)return;
      _b(180,c.currentTime,.18,'sawtooth',.2,.004,.07);
    },
    // Tennis
    hit() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(520,t,.04,'square',.28,.001,.03);
      _b(320,t+.02,.06,'triangle',.12,.002,.04);
    },
    serve() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(420,t,.03,'square',.22,.001,.02);
      _b(260,t+.03,.08,'triangle',.14,.002,.06);
    },
    net() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(200,t,.10,'sawtooth',.22,.003,.07);
      _b(150,t+.06,.12,'sawtooth',.15,.003,.08);
    },
    point() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [N.C5,N.E5,N.G5].forEach((f,i)=>_b(f,t+i*.07,.13,'square',.2,.004,.05));
    },
    fault() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(280,t,.08,'sawtooth',.2,.002,.06);
      _b(200,t+.07,.12,'sawtooth',.16,.002,.07);
    },
    // Bike
    jump() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      const osc=c.createOscillator(),g=c.createGain();
      osc.connect(g);g.connect(_master);
      osc.type='sine';osc.frequency.setValueAtTime(220,t);
      osc.frequency.linearRampToValueAtTime(440,t+.15);
      g.gain.setValueAtTime(.2,t);g.gain.linearRampToValueAtTime(0,.25+t);
      osc.start(t);osc.stop(t+.26);
    },
    land() {
      const c=_ac();if(!c)return;
      _b(120,c.currentTime,.08,'sawtooth',.25,.001,.06);
    },
    crash() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [180,140,100,70].forEach((f,i)=>_b(f,t+i*.04,.14,'sawtooth',.28,.002,.08));
    },
    // Cap baseball
    pitch() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      const osc=c.createOscillator(),g=c.createGain();
      osc.connect(g);g.connect(_master);
      osc.type='sine';osc.frequency.setValueAtTime(600,t);
      osc.frequency.linearRampToValueAtTime(300,t+.18);
      g.gain.setValueAtTime(.18,t);g.gain.linearRampToValueAtTime(0,t+.2);
      osc.start(t);osc.stop(t+.21);
    },
    hitBall() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(800,t,.03,'square',.3,.001,.02);
      _b(400,t+.02,.09,'triangle',.18,.002,.06);
    },
    strike() {
      const c=_ac();if(!c)return;
      _b(N.A3,c.currentTime,.14,'sawtooth',.22,.003,.07);
    },
    homerun() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [N.C5,N.E5,N.G5,N.C5*2].forEach((f,i)=>_b(f,t+i*.09,.18,'square',.22,.005,.06));
      _b(N.C3,t,.55,'triangle',.14,.01,.1);
    },
    // Keshibato (eraser battle)
    flick() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      const osc=c.createOscillator(),g=c.createGain();
      osc.connect(g);g.connect(_master);
      osc.type='sine';osc.frequency.setValueAtTime(800,t);
      osc.frequency.linearRampToValueAtTime(200,t+.12);
      g.gain.setValueAtTime(.22,t);g.gain.linearRampToValueAtTime(0,t+.14);
      osc.start(t);osc.stop(t+.15);
    },
    bump() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      _b(300,t,.06,'triangle',.2,.001,.05);
      _b(220,t+.04,.08,'triangle',.14,.001,.06);
    },
    fallOff() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      const osc=c.createOscillator(),g=c.createGain();
      osc.connect(g);g.connect(_master);
      osc.type='sawtooth';osc.frequency.setValueAtTime(440,t);
      osc.frequency.linearRampToValueAtTime(80,t+.4);
      g.gain.setValueAtTime(.2,t);g.gain.linearRampToValueAtTime(0,t+.45);
      osc.start(t);osc.stop(t+.46);
    },
    // Mahjong
    draw() {
      const c=_ac();if(!c)return;
      _b(N.G5,c.currentTime,.06,'triangle',.14,.002,.04);
    },
    discard() {
      const c=_ac();if(!c)return;
      _b(N.E4,c.currentTime,.07,'triangle',.16,.002,.05);
    },
    tsumo() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [N.C5,N.G5,N.E5,N.C5*2].forEach((f,i)=>_b(f,t+i*.1,.2,'square',.2,.005,.07));
    },
    ron() {
      const c=_ac();if(!c)return;const t=c.currentTime;
      [N.A4,N.E5,N.A5].forEach((f,i)=>_b(f,t+i*.09,.18,'sawtooth',.2,.004,.07));
      _b(N.A3,t,.4,'triangle',.13,.01,.12);
    }
  };

  const THEMES = {
    title: {
      bpm: 152,
      mel: [
        [N.E5,.5],[N.B4,.25],[N.C5,.25],
        [N.D5,.25],[N.C5,.25],[N.B4,.5],
        [N.A4,.5],[N.A4,.25],[N.C5,.25],
        [N.E5,.5],[N.D5,.25],[N.C5,.25],
        [N.B4,.75],[N.C5,.25],
        [N.D5,.5],[N.E5,.5],
        [N.C5,.5],[N.A4,.5],
        [N.A4,.5],[0,1],
        [0,.25],[N.D5,.5],[N.F5,.25],
        [N.A5,.5],[N.G5,.25],[N.F5,.25],
        [N.E5,.75],[N.C5,.25],
        [N.E5,.5],[N.D5,.25],[N.C5,.25],
        [N.B4,.5],[N.B4,.25],[N.C5,.25],
        [N.D5,.5],[N.E5,.5],
        [N.C5,.5],[N.A4,.5],
        [N.A4,.5],[0,1],
      ],
      bass: [
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.E3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.F3,.5],[0,.5],[N.F3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.D3,.5],[0,.5],[N.D3,.5],[0,.5],
        [N.D3,.5],[0,.5],[N.D3,.5],[0,.5],
        [N.E3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
        [N.E3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.E3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.F3,.5],[0,.5],[N.F3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.A3,.5],[0,.5],
      ]
    },
    game: {
      bpm: 120,
      mel: [
        [N.C5,.5],[0,.25],[N.E5,.25],
        [N.G4,.75],[0,.25],
        [N.A4,.5],[0,.25],[N.C5,.25],
        [N.G4,.5],[0,.5],
        [N.E4,.5],[0,.25],[N.G4,.25],
        [N.A4,.25],[N.B4,.25],[N.A4,.25],[N.G4,.25],
        [N.C5,.5],[N.D5,.25],[N.C5,.25],
        [N.G4,.5],[0,.5],
        [N.E5,.5],[0,.25],[N.D5,.25],
        [N.C5,.5],[N.B4,.5],
        [N.A4,.5],[0,.25],[N.C5,.25],
        [N.E5,.5],[N.D5,.5],
        [N.C5,.25],[N.D5,.25],[N.E5,.25],[N.D5,.25],
        [N.C5,.5],[N.G4,.5],
        [N.A4,.5],[N.E4,.5],
        [N.G4,.5],[0,.5],
      ],
      bass: [
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.F3,.5],[0,.5],[N.C3,.5],[0,.5],
        [N.G3,.5],[0,.5],[N.G3,.5],[0,.5],
      ]
    },
    tennis: {
      bpm: 140,
      mel: [
        [N.E5,.25],[N.D5,.25],[N.C5,.5],[0,.5],
        [N.G5,.25],[N.F5,.25],[N.E5,.5],[0,.5],
        [N.A5,.5],[N.G5,.25],[N.E5,.25],
        [N.D5,.5],[0,.5],
        [N.E5,.25],[N.D5,.25],[N.C5,.5],[0,.5],
        [N.F5,.5],[N.E5,.25],[N.D5,.25],
        [N.G5,.5],[N.E5,.5],
        [N.C5,.5],[0,.5],
      ],
      bass: [
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.D3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.F3,.5],[0,.5],[N.C3,.5],[0,.5],
        [N.G3,.5],[0,.5],[N.D3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.C3,.5],[0,.5],
      ]
    },
    baseball: {
      bpm: 132,
      mel: [
        [N.C5,.5],[N.E5,.5],
        [N.G5,.5],[N.E5,.5],
        [N.F5,.5],[N.D5,.5],
        [N.E5,.5],[0,.5],
        [N.C5,.5],[N.E5,.5],
        [N.G5,.5],[N.A5,.5],
        [N.G5,.25],[N.F5,.25],[N.E5,.25],[N.D5,.25],
        [N.C5,.5],[0,.5],
      ],
      bass: [
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.C3,.5],[0,.5],
        [N.F3,.5],[0,.5],[N.F3,.5],[0,.5],
        [N.G3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.F3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
      ]
    },
    mahjong: {
      bpm: 90,
      mel: [
        [N.E4,.5],[N.G4,.5],
        [N.A4,.5],[N.G4,.5],
        [N.E4,.5],[N.D4,.5],
        [N.C4,.5],[0,.5],
        [N.G4,.5],[N.A4,.5],
        [N.B4,.5],[N.A4,.5],
        [N.G4,.5],[N.E4,.5],
        [N.D4,.5],[0,.5],
        [N.E4,.25],[N.F4,.25],[N.G4,.5],[N.A4,.5],
        [N.G4,.5],[N.E4,.5],
        [N.A4,.5],[N.G4,.25],[N.E4,.25],
        [N.D4,.5],[0,.5],
        [N.C4,.5],[N.E4,.5],
        [N.G4,.5],[N.E4,.5],
        [N.A4,.5],[N.G4,.5],
        [N.C4,.5],[0,.5],
      ],
      bass: [
        [N.C3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.A3,.5],[0,.5],[N.E3,.5],[0,.5],
        [N.G3,.5],[0,.5],[N.D3,.5],[0,.5],
        [N.C3,.5],[0,.5],[N.G3,.5],[0,.5],
      ]
    }
  };

  function _scheduleSeq(seq, key, t0, vol, waveType) {
    const beat = 60 / seq.bpm;
    let t = t0, total = 0;
    for (const [f, d] of seq[key]) {
      const dur = d * beat;
      if (f) _b(f, t, dur * 0.88, waveType, vol, 0.004, 0.04);
      t += dur; total += dur;
    }
    return total;
  }

  function _scheduleLoop() {
    if (!_bgmRunning || !_ctx) return;
    const seq = THEMES[_bgmTheme] || THEMES.title;
    const now = _ctx.currentTime;
    const dur = _scheduleSeq(seq, 'mel',  now, 0.14, 'square');
    _scheduleSeq(seq, 'bass', now, 0.11, 'triangle');
    _bgmTimer = setTimeout(_scheduleLoop, Math.max(50, (dur - 0.25) * 1000));
  }

  function startBGM(theme) {
    if (_muted) return;
    _bgmTheme = theme || _bgmTheme;
    _bgmRunning = true;
    if (_bgmTimer) { clearTimeout(_bgmTimer); _bgmTimer = null; }
    _ac();
    _scheduleLoop();
  }

  function stopBGM() {
    _bgmRunning = false;
    if (_bgmTimer) { clearTimeout(_bgmTimer); _bgmTimer = null; }
  }

  function setMuted(v) {
    _muted = v;
    localStorage.setItem('snd_muted', v ? '1' : '0');
    _ac();
    if (_master) {
      _master.gain.cancelScheduledValues(_ctx.currentTime);
      _master.gain.setTargetAtTime(v ? 0 : 0.55, _ctx.currentTime, 0.1);
    }
    if (v) stopBGM();
  }

  function toggleMute() { setMuted(!_muted); return _muted; }
  function isMuted() { return _muted; }

  function createBtn(parent) {
    if (document.getElementById('snd-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'snd-btn';
    btn.style.cssText = [
      'position:fixed','bottom:14px','right:14px',
      'background:#1e1e2e','border:1px solid #444','border-radius:6px',
      'color:#888','font-size:0.85rem','padding:5px 10px',
      'cursor:pointer','z-index:999','font-family:monospace',
      'letter-spacing:1px','transition:color .15s,border-color .15s'
    ].join(';');
    const upd = () => {
      const m = _muted;
      btn.textContent = m ? '🔇' : '♪';
      btn.title = m ? 'Unmute' : 'Mute';
      btn.style.color = m ? '#555' : '#00d4aa';
      btn.style.borderColor = m ? '#333' : '#00d4aa';
    };
    upd();
    btn.addEventListener('click', () => {
      const m = toggleMute();
      upd();
      if (!m) startBGM();
    });
    (parent || document.body).appendChild(btn);
    return btn;
  }

  w.SND = { sfx, startBGM, stopBGM, toggleMute, isMuted, createBtn };
})(window);
