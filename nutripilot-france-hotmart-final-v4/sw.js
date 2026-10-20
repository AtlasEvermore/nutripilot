const CACHE = 'nutripilot-v29-20261020-aurora';
const CORE = ['/', '/index.html', '/styles.css', '/app.js', '/food.js', '/exercises.js', '/icon.svg', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest', '/fonts/bricolage.woff', '/fonts/figtree.woff'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  const isAppShell = ['/', '/index.html', '/styles.css', '/app.js', '/food.js', '/exercises.js', '/manifest.webmanifest'].includes(url.pathname) || url.pathname.startsWith('/i18n/');
  if (isAppShell) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      }))
  );
});
