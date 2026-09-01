const CACHE_NAME = "math2-flashcards-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./math2-flashcards-data.js",
  "./katex-0.18.4.min.js",
  "./manifest.webmanifest",
  "./flashcards-icon.svg",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return Promise.all(APP_SHELL.map(function (asset) {
          return cache.add(asset).catch(function () { return undefined; });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (key) { return key.startsWith("math2-flashcards-") && key !== CACHE_NAME; })
        .map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { return cache.put("./index.html", copy); });
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match("./index.html");
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      const refresh = fetch(request)
        .then(function (response) {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) { return cache.put(request, copy); });
          }
          return response;
        })
        .catch(function () { return cached; });
      return cached || refresh;
    })
  );
});
