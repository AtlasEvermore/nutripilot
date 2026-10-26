const CACHE = 'nutripilot-v45-20261026-module-art';
const CORE = ['/', '/index.html', '/styles.css', '/app.js', '/i18n-launch.js', '/food.js', '/exercises.js', '/icon.svg', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest', '/fonts/bricolage.woff', '/fonts/figtree.woff'];

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
  // Current legal/contact details and deletion forms must not remain frozen in an old app cache.
  if (['/privacy', '/terms', '/delete-account', '/support'].includes(url.pathname)) return;

  const isAppShell = ['/', '/index.html', '/styles.css', '/app.js', '/i18n-launch.js', '/food.js', '/exercises.js', '/manifest.webmanifest'].includes(url.pathname) || url.pathname.startsWith('/i18n/');
  if (isAppShell) {
    event.respondWith(
      // Prefer fresh shell files, use the saved copy after 2.5 s, and bound a stalled network to 10 s.
      new Promise((resolve) => {
        let done = false;
        const controller = new AbortController();
        const fallback = async () => {
          try { return await caches.match(event.request) || (event.request.mode === 'navigate' ? await caches.match('/index.html') : undefined); }
          catch { return undefined; }
        };
        const finish = response => { if (!done) { done = true; clearTimeout(timer); resolve(response); } };
        const timer = setTimeout(() => { void fallback().then(cached => { if (cached) finish(cached); }); }, 2500);
        const deadline = setTimeout(() => {
          controller.abort();
          finish(Response.error());
        }, 10000);
        const complete = response => { clearTimeout(deadline); finish(response); };
        fetch(event.request, { cache: 'no-cache', signal: controller.signal })
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              void caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
            }
            if (response.status >= 500) return fallback().then(cached => complete(cached || response));
            complete(response);
          })
          .catch(() => {
            void fallback().then(cached => complete(cached || Response.error()));
          });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      }))
  );
});
