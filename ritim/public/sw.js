// Keeps the app shell available offline. Data requests (/api) always go to the network.
const CACHE = 'ritim-v2';
const SHELL = ['/', '/manifest.webmanifest', '/vendor/Sortable.min.js', '/icons/apple-touch-icon.png', '/icons/icon-192.png'];
const NAV_TIMEOUT_MS = 4000;

// Shown when the page can neither be fetched nor found in the cache, so the app never opens to a blank screen.
const FALLBACK = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Ritim</title>
<style>:root{color-scheme:light dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#e4e5e9;color:#2e2f35;
font:16px/1.5 system-ui,-apple-system,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
@media (prefers-color-scheme:dark){body{background:#26272c;color:#ececef}}
button{margin-top:18px;font:600 15px system-ui;padding:14px 28px;border:0;border-radius:14px;color:#fff;background:linear-gradient(110deg,#9b1c1c,#5e0f12)}</style>
</head><body><div><h1 style="margin:0 0 8px">Ritim açılamadı</h1>
<p style="margin:0;opacity:.75">Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.</p>
<button onclick="location.reload()">Tekrar dene</button></div></body></html>`;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fetchWithTimeout(req, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(req).then(r => { clearTimeout(t); resolve(r); }, err => { clearTimeout(t); reject(err); });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  // Pages: network first so updates arrive; cached copy when the network is slow or down; a retry page as a last resort.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = await fetchWithTimeout(req, NAV_TIMEOUT_MS);
        if (res.ok && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('/', copy));
          return res;
        }
        if (res.ok) return new Response(await res.blob(), { headers: res.headers });
        return (await caches.match('/')) || res;
      } catch (err) {
        return (await caches.match('/')) ||
          new Response(FALLBACK, { headers: { 'content-type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  // Everything else (scripts, icons, fonts): cache first.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
