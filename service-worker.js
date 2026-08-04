// Service worker: red primero, copia guardada como respaldo sin conexión.
//
// Con conexión a internet, SIEMPRE se busca la versión más nueva del
// servidor — así una actualización nunca se queda "pegada" mostrando una
// versión vieja. Solo si no hay señal, se usa la última copia guardada.
//
// Ningún dato de las marcas pasa por acá — solo los archivos de la app en sí.

const CACHE = 'marcas-app-v2';
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
    fetch(evento.request)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(evento.request))
  );
});
