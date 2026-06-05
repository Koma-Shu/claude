const CACHE = 'arcade-v1.5';

// Base path of the SW (e.g. '/claude/' on GitHub Pages, '/' on root)
const BASE = self.location.pathname.replace(/sw\.js$/, '');

const GAME_FILES = [
  '',
  'index.html',
  'sound.js',
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
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
].map(f => BASE + f);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(GAME_FILES))
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

  // Game & static files → cache first, update in background
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
