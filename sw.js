const CACHE = 'arcade-v3.41';

// Base path of the SW (e.g. '/claude/' on GitHub Pages, '/' on root)
const BASE = self.location.pathname.replace(/sw\.js$/, '');

// アプリごとにディレクトリ分割（ARCADES/{ARCADE,STUDY,ENGLISH}, Network/）。
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

  // --- ARCADES/STUDY ---
  'ARCADES/STUDY/study.html',
  'ARCADES/STUDY/srs.js',
  'ARCADES/STUDY/study-data.js',
  'ARCADES/STUDY/study-data-spinum.js',
  'ARCADES/STUDY/study-data-verbal.js',
  'ARCADES/STUDY/study-data-calc.js',
  'ARCADES/STUDY/study-data-open.js',
  'ARCADES/STUDY/study-data-ext-spi.js',
  'ARCADES/STUDY/study-data-ext-tama-num.js',
  'ARCADES/STUDY/study-data-ext-tama-verb.js',
  'ARCADES/STUDY/study-data-ext-tama-eng.js',
  'ARCADES/STUDY/study-data-ext-tgweb-num.js',
  'ARCADES/STUDY/study-data-ext-tgweb-verb.js',
  'ARCADES/STUDY/study-data-ext-tgweb-eng.js',
  'ARCADES/STUDY/study-data-ext-tgweb-num2.js',
  'ARCADES/STUDY/study-data-ext-tama-num2.js',

  // --- ARCADES/ENGLISH ---
  'ARCADES/ENGLISH/english.html',
  'ARCADES/ENGLISH/english-diary.html',
  'ARCADES/ENGLISH/english-data.js',
  'ARCADES/ENGLISH/english-sync.js',
  'ARCADES/ENGLISH/english.webmanifest',
  'ARCADES/ENGLISH/icon-eng-180.png',
  'ARCADES/ENGLISH/icon-eng-192.png',
  'ARCADES/ENGLISH/icon-eng-512.png',

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
