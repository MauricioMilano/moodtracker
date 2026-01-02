const CACHE_NAME = "mood-journal-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/icon.svg",
  "/favicon.ico",
  "/manifest.webmanifest"
];

// Install: cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // swallow errors to avoid failing install if some resources aren't available
      });
    })
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ).then(() => self.clients.claim())
    )
  );
});

// Fetch: try network, fall back to cache, and cache successful network responses
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // only cache successful responses
        if (!response || response.status >= 400 || response.type === "opaque") {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          try {
            cache.put(event.request, responseClone);
          } catch (e) {
            // ignore put errors for cross-origin or opaque requests
          }
        });
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          return cached || caches.match("/index.html");
        })
      )
  );
});

// Listen for skipWaiting message (useful for updates)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});