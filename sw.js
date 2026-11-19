// El Taller: guarda la app en el dispositivo para que abra rápido y funcione sin conexión.
2


// Al publicar una versión nueva, cambiá el número de VERSION para que los teléfonos la actualicen.
3
const VERSION = 'el-taller-v14';
4
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'favicon.svg', 'icon-192.png', 'icon-512.png',
5
  'fonts/LeagueGothic-Regular.ttf', 'fonts/GolosText-Regular.ttf', 'fonts/GolosText-Medium.ttf',
6
  'fonts/GolosText-SemiBold.ttf', 'fonts/GolosText-Bold.ttf'];
7
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => Promise.all(ARCHIVOS.map(a => c.add(a).catch(() => {})))).then(() => self.skipWaiting())); });
8
self.addEventListener('activate', e => {
9
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
10
});
11
self.addEventListener('fetch', e => {
12
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
13
  // primero la red (para recibir actualizaciones); si no hay conexión, la copia guardada
14
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); return r; })
15
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html'))));
16
});
