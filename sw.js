const CACHE_NAME = "wedding-invitation-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/assets/audio/wedding-song.mp3",
  "/assets/images/couple.jpg",
  "/assets/images/bride.jpg",
  "/assets/images/groom.jpg",
  "/assets/images/venue.jpg",
  "/assets/images/gallery1.jpg",
  "/assets/images/gallery2.jpg",
  "/assets/images/gallery3.jpg",
  "/assets/images/gallery4.jpg",
  "/assets/images/bca-logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
