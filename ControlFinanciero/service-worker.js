// Service Worker para la aplicación Control Financiero

const CACHE_NAME = "control-financiero-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/main.js",
  "/js/charts.js",
  "/js/api.js",
  "/manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache abierto");
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia de caché: Network First, con fallback a cache
self.addEventListener("fetch", (event) => {
  // Ignorar solicitudes a Google APIs o a otros dominios
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.startsWith("https://cdn.jsdelivr.net") &&
    !event.request.url.startsWith("https://cdnjs.cloudflare.com")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si obtenemos una respuesta válida, la guardamos en caché
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si la red falla, intentamos obtener el recurso de caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Si no tenemos caché para esta solicitud, verificamos si es una solicitud de página
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }

          return new Response(
            "No hay conexión a Internet y el recurso no está en caché",
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({
                "Content-Type": "text/plain",
              }),
            }
          );
        });
      })
  );
});

// Sincronización en segundo plano
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-transactions") {
    event.waitUntil(syncTransactions());
  }
});

// Función para sincronizar transacciones pendientes
function syncTransactions() {
  return fetch("/api/sync")
    .then((response) => response.json())
    .then((data) => {
      console.log("Sincronización exitosa:", data);
    })
    .catch((error) => {
      console.error("Error en la sincronización:", error);
    });
}

// Notificaciones push
self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/img/icon-192x192.png",
    badge: "/img/badge.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Acción al hacer clic en una notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of windowClients) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      // Si no hay ventanas abiertas, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
