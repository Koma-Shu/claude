/* ratings.js — ゲームページ共通の「評価・コメント」欄。
   ページ側に #rlist / #avg-d / #rtoggle / #rform / .star / #cmt / #rsub の要素を置き、
   initRatings({ game, sb, t, lang }) を呼ぶ。投稿者名はサーバー側で付く（v7）。 */
function initRatings(opts){
  'use strict';
  var game = opts.game, sb = opts.sb, t = opts.t, lang = opts.lang;
  var esc = function (s) { return String(s).replace(/</g, '&lt;'); };

  async function load(){
    try {
      var rows = await sb('/rest/v1/ratings?game=eq.' + game + '&order=created_at.desc&limit=20') || [];
      render(rows); avg(rows);
    } catch (e) { render([]); }
  }
  async function submit(stars, cmt){
    var me = JSON.parse(localStorage.getItem('arcade_user') || 'null');
    var body = { game: game, stars: stars, comment: cmt || null };
    if (me) { body.user_id = me.id; body.username = me.username; }
    await sb('/rest/v1/ratings', { method: 'POST', body: JSON.stringify(body) });
    load();
  }
  function render(list){
    var el = document.getElementById('rlist');
    if (!list.length) { el.innerHTML = '<div style="color:#333;text-align:center;font-size:0.72rem;padding:8px">' + t('noRatings') + '</div>'; return; }
    el.innerHTML = list.map(function (r) {
      return '<div class="ri"><span class="rs">' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</span>' +
        (r.username ? '<span class="rd" style="color:#00d4aa">@' + esc(r.username) + '</span>' : '') +
        '<span class="rd">' + new Date(r.created_at).toLocaleDateString(lang() === 'ja' ? 'ja-JP' : 'en-US') + '</span>' +
        (r.comment ? '<p class="rc">' + esc(r.comment) + '</p>' : '') + '</div>';
    }).join('');
  }
  function avg(list){
    var el = document.getElementById('avg-d');
    if (!list.length) { el.textContent = ''; return; }
    var a = (list.reduce(function (s, r) { return s + r.stars; }, 0) / list.length).toFixed(1);
    el.innerHTML = '<span>' + '★'.repeat(Math.round(a)) + '</span> ' + a + ' (' + list.length + (lang() === 'ja' ? '件' : '') + ')';
  }

  var sel = 0;
  var stars = document.querySelectorAll('.star');
  document.getElementById('rtoggle').addEventListener('click', function () { document.getElementById('rform').classList.toggle('open'); });
  stars.forEach(function (s) {
    s.addEventListener('click', function () { sel = +s.dataset.v; stars.forEach(function (st, i) { st.classList.toggle('active', i < sel); }); });
  });
  document.getElementById('rsub').addEventListener('click', async function () {
    if (!sel) { alert(lang() === 'ja' ? '星を選んでください' : 'Please select a star rating'); return; }
    await submit(sel, document.getElementById('cmt').value.trim());
    sel = 0; stars.forEach(function (s) { s.classList.remove('active'); });
    document.getElementById('cmt').value = '';
    document.getElementById('rform').classList.remove('open');
  });
  load();
}
