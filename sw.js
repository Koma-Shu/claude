const CACHE = 'arcade-v3.15';

// Base path of the SW (e.g. '/claude/' on GitHub Pages, '/' on root)
const BASE = self.location.pathname.replace(/sw\.js$/, '');

const GAME_FILES = [
  '',
  'index.html',
  'arcade.html',
  'sound.js',
  'cards.js',
  'netplay.js',
  'track.js',
  'nav.js',
  'snake.html',
  'symbiont.html',
  'reversi.html',
  'gomoku.html',
  'chess.html',
  'shogi.html',
  'capbaseball.html',
  'keshibato.html',
  'bikerun.html',
  'tennis.html',
  'mahjong.html',
  'connect4.html',
  'mancala.html',
  'blackjack.html',
  'poker.html',
  'daifugo.html',
  'sevens.html',
  'memory.html',
  'oldmaid.html',
  'yacht.html',
  'study.html',
  'srs.js',
  'study-data.js',
  'study-data-spinum.js',
  'study-data-verbal.js',
  'study-data-calc.js',
  'study-data-open.js',
  'study-data-ext-spi.js',
  'study-data-ext-tama-num.js',
  'study-data-ext-tama-verb.js',
  'study-data-ext-tama-eng.js',
  'study-data-ext-tgweb-num.js',
  'study-data-ext-tgweb-verb.js',
  'study-data-ext-tgweb-eng.js',
  'study-data-ext-tgweb-num2.js',
  'study-data-ext-tama-num2.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
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
    }).catch(() => caches.match(e.request))
  );
});
