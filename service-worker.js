const APP_VERSION = 'v1.6.1'; // 👈 Change this whenever you update
const CACHE_NAME = 'patnametro-' + APP_VERSION;
const urlsToCache = [
  '/',
  '/index.html',
  '/data/icons/redStn.png',
  '/data/icons/blueStn.png',
  '/data/icons/connStn1.png',
  '/data/icons/stnFrom.png',
  '/data/icons/stnTo.png',
  '/manifest.json',
  '/data/icons/icon-192.png',
  '/data/icons/icon-512.png'
];


// Install event - caching static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event - serve cached content or go to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

