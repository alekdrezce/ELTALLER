// El Taller: guarda la app en el dispositivo para que abra rápido y funcione sin conexión.
// Al publicar una versión nueva, cambiá el número de VERSION para que los teléfonos la actualicen.
const VERSION = 'el-taller-v2';
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'favicon.svg', 'icon-192.png', 'icon-512.png',
  'fonts/LeagueGothic-Regular.ttf', 'fonts/GolosText-Regular.ttf', 'fonts/GolosText-Medium.ttf',
  'fonts/GolosText-SemiBold.ttf', 'fonts/GolosText-Bold.ttf'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // primero la red (para recibir actualizaciones); si no hay conexión, la copia guardada
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html'))));
});
