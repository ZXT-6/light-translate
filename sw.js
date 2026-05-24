const CACHE = 'translator-v1';
const ASSETS = [
  './',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // For API calls: network first, don't cache
  if (e.request.url.includes('api.mymemory') || e.request.url.includes('translate.argosopentech')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // For app assets: cache first, then network
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
