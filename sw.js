const CACHE = 'arcade-v3.46';

// Base path of the SW (e.g. '/claude/' on GitHub Pages, '/' on root)
const BASE = self.location.pathname.replace(/sw\.js$/, '');

// アプリごとにディレクトリ分割（ARCADES/ARCADE, Network/, Tools/）。ENGLISH・STUDY は personal-tools へ移転済み。
// ルートにはポータル・認証・共有ライブラリ・PWA アセットのみが残る。
const GAME_FILES = [
  // --- root: portal / auth / shared libs / PWA ---
  '',
  'index.html',
  'login.html',
  'register.html',
  'profile.html',
  'sound.js',
  'cards.js',
  'netplay.js',
  'track.js',
  'nav.js',
  'sbauth.js',
  'ratings.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',

  // --- ARCADES/ARCADE ---
  'ARCADES/ARCADE/arcade.html',
  'ARCADES/ARCADE/snake.html',
  'ARCADES/ARCADE/symbiont.html',
  'ARCADES/ARCADE/reversi.html',
  'ARCADES/ARCADE/gomoku.html',
  'ARCADES/ARCADE/chess.html',
  'ARCADES/ARCADE/shogi.html',
  'ARCADES/ARCADE/capbaseball.html',
  'ARCADES/ARCADE/keshibato.html',
  'ARCADES/ARCADE/bikerun.html',
  'ARCADES/ARCADE/tennis.html',
  'ARCADES/ARCADE/mahjong.html',
  'ARCADES/ARCADE/connect4.html',
  'ARCADES/ARCADE/mancala.html',
  'ARCADES/ARCADE/blackjack.html',
  'ARCADES/ARCADE/poker.html',
  'ARCADES/ARCADE/daifugo.html',
  'ARCADES/ARCADE/sevens.html',
  'ARCADES/ARCADE/memory.html',
  'ARCADES/ARCADE/oldmaid.html',
  'ARCADES/ARCADE/yacht.html',



  // --- Network ---
  'Network/packet-journey/index.html',
].map(f => BASE + f);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      // Bypass HTTP cache on pre-cache so the very first stored copy is fresh
      GAME_FILES.map(f => fetch(new Request(f, { cache: 'reload' }))
        .then(res => res && res.status === 200 ? c.put(f, res) : null)
        .catch(() => null))
    ))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Supabase / external API → network only
  if (url.hostname !== self.location.hostname) return;

  // Only GET is cacheable — let POST etc. pass through untouched
  if (e.request.method !== 'GET') return;

  // Game & static files → network first (always fresh when online),
  // fall back to cache when offline. `cache: 'reload'` bypasses the browser's
  // HTTP cache so we never get a stale copy (GitHub Pages sets max-age=600);
  // this guarantees updates show up immediately instead of being pinned to an
  // old cached file.
  e.respondWith(
    fetch(e.request, { cache: 'reload' }).then(res => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() =>
      // オフライン時の最終フォールバックはポータル（ルートに残る唯一の入口）
      caches.match(e.request).then(r => r || caches.match(BASE + 'index.html'))
    )
  );
});
