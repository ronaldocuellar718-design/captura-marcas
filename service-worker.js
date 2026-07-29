// Service worker mínimo: guarda una copia local de la app la primera vez
// que se abre, para que después funcione sin conexión a internet.
// Ningún dato de las marcas pasa por acá — solo los archivos de la app en sí.

const CACHE = 'marcas-app-v1';
const ARCHIVOS = ['./', './index.html', './manifest.json',
                  './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuesta) => respuesta || fetch(evento.request))
  );
});
