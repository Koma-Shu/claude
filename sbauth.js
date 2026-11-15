/* sbauth.js — ARCADE のログインセッションを Supabase へのリクエストに付ける共通スクリプト。
   誰が何を読み書きできるかはサーバー側（RLS, supabase_migrate_v7_security.sql）が判定する。
   各ページの fetch ヘルパーを個別に書き換えずに済むよう、Supabase 宛ての fetch にだけ
   x-arcade-session ヘッダーを足す。どのページでも、他のスクリプトより先に読み込むこと。 */
(function (w) {
  'use strict';
  var SB_URL = 'https://qveznkwqfjjtjxqxdyls.supabase.co';
  var SB_KEY = 'sb_publishable_Eu8ppaJ-BxQvwGyj1UlNjw_vyywq8ge';

  function current() {
    try { return JSON.parse(localStorage.getItem('arcade_user') || 'null'); } catch (e) { return null; }
  }
  // 旧方式（トークン無し）のログイン状態はサーバーに認められないので、ログインし直してもらう
  var u = current();
  if (u && !u.token) { try { localStorage.removeItem('arcade_user'); } catch (e) {} }

  var origFetch = w.fetch.bind(w);
  w.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var me = url.indexOf(SB_URL) === 0 ? current() : null;
    if (me && me.token) {
      init = Object.assign({}, init || {});
      var h = new Headers(init.headers || (typeof input !== 'string' && input.headers) || {});
      h.set('x-arcade-session', me.token);
      init.headers = h;
    }
    return origFetch(input, init);
  };

  w.arcadeLogout = function () {
    var p = current() && current().token
      ? w.fetch(SB_URL + '/rest/v1/rpc/arcade_logout', { method: 'POST',
          headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: '{}' })
          .catch(function () {})
      : Promise.resolve();
    return p.then(function () { try { localStorage.removeItem('arcade_user'); } catch (e) {} });
  };
})(window);
