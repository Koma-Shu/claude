// HTML Viewer — オフライン用 Service Worker
// 常にネットワーク優先（更新がすぐ反映される）、オフライン時はキャッシュから表示。
const CACHE = 'html-viewer-v2';
const BASE = self.location.pathname.replace(/sw\.js$/, '');
const FILES = ['', 'index.html', 'config.js', 'viewer.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'].map(f => BASE + f);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(
    FILES.map(f => fetch(new Request(f, { cache: 'reload' }))
      .then(r => r && r.status === 200 ? c.put(f, r) : null).catch(() => null))
  )));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'reload' }).then(res => {
      if (res && res.status === 200){ const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match(BASE + 'index.html')))
  );
});
