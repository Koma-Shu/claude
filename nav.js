/* nav.js — unified "back to ARCADE" button.
   Gives every game the SAME back control in the SAME place (fixed top-right),
   regardless of how that game laid out its own button. It hides each game's
   bespoke back control (anchor, #back-btn, #backbtn, .back button, or a
   dynamically-created "戻る" button) and injects one standardized button.
   Include this once, just before </body>, on every game page. */
(function () {
  'use strict';
  var TARGET = 'arcade.html', LABEL = '← ARCADE';

  // 1) Standard style + hide the common legacy back controls.
  var st = document.createElement('style');
  st.textContent =
    '#back-btn,#backbtn,a.back,button.back{display:none!important;}' +
    '#arc-back{position:fixed;top:14px;right:14px;z-index:99999;' +
      'background:#1e1e2e;border:1px solid #444;border-radius:6px;color:#888;' +
      'font-family:"Courier New",monospace;font-size:0.72rem;letter-spacing:1px;' +
      'padding:6px 11px;cursor:pointer;text-decoration:none;line-height:1;' +
      'transition:color .15s,border-color .15s;}' +
    '#arc-back:hover{color:#eee;border-color:#888;}';
  (document.head || document.documentElement).appendChild(st);

  // 2) Inject the one standardized button.
  function inject() {
    if (document.getElementById('arc-back')) return;
    var a = document.createElement('a');
    a.id = 'arc-back'; a.href = TARGET; a.textContent = LABEL;
    (document.body || document.documentElement).appendChild(a);
  }

  // 3) Hide dynamically-created back buttons (canvas games build them in JS,
  //    so they have no stable selector). Match by their unambiguous label.
  var BACK_LABELS = ['戻る', 'もどる', '← ARCADE',
                     'Back', 'BACK', '← HOME'];
  function sweep() {
    var els = document.querySelectorAll('a,button');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.id === 'arc-back') continue;
      var t = (el.textContent || '').trim();
      if (BACK_LABELS.indexOf(t) >= 0) el.style.display = 'none';
    }
  }

  function run() { inject(); sweep(); }
  if (document.body) run();
  else document.addEventListener('DOMContentLoaded', run);
  // Re-sweep to catch buttons created/relabelled after initial load (i18n, online UI).
  setTimeout(sweep, 400);
  setTimeout(sweep, 1200);
})();
