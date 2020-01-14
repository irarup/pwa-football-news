const CACHE_NAME = "football-news-v3";
var urlsToCache = [
  "/",
  "/icon.png",
  "/nav.html",
  "/index.html",
  "/team.html",
  "/manifest.json",
  "/service-worker.js",
  "/pages/home.html",
  "/pages/match.html",
  "/pages/standing.html",
  "/pages/favorite.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/matches.js",
  "/js/indexedDB/idb.js",
  "/js/indexedDB/indexedDB.js",
  "/img/LaLiga.png",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
  ];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});


self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
