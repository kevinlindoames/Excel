// Service Worker para la aplicación Control Financiero

const CACHE_NAME = "control-financiero-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/api.js",
  "/js/charts.js",
  "/js/main.js",
  "/js/modal-utils.js",
  "/manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log(
          "Service Worker: Algunos recursos no pudieron ser cacheados"
        );
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error(
          "Error durante la instalación del Service Worker:",
          error
        );
      })
  );
});

// Activación y limpieza de caches antiguas
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Limpiando cache antigua", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia de cache: Primero intenta con la red, si falla usa el cache
self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes(
      "/.well-known/appspecific/com.chrome.devtools.json"
    )
  ) {
    // Ignorar solicitudes de Chrome DevTools - esto es normal y no es un error
    return;
  }

  // Para solicitudes de la API de Google, siempre ir a la red
  if (
    event.request.url.includes("googleapis.com") ||
    event.request.url.includes("google.com") ||
    event.request.url.includes("open.er-api.com")
  ) {
    return fetch(event.request);
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonamos y almacenamos en cache
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Si la red falla, intentamos recuperar del cache
        return caches.match(event.request);
      })
  );
});

// Manejar mensajes desde la aplicación
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
