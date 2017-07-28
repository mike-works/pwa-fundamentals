import { precacheStaticAssets, removeUnusedCaches, ALL_CACHES, ALL_CACHES_LIST } from './sw/caches.js';

const FALLBACK_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // get the fallback image
      caches.open(ALL_CACHES.fallbackImages)
        .then(cache => {
          cache.add(FALLBACK_IMAGE_URL);
        }),
      // populate the precache stuff
      precacheStaticAssets()
    ])
  )
});

self.addEventListener('activate', (event) => {
  // caches.keys().then(cacheNames => {})
  event.waitUntil(
    removeUnusedCaches(ALL_CACHES_LIST)
  )
});

function fetchImageOrFallback(fetchEvent) {
  return fetch(fetchEvent.request, { 
    mode: 'cors',
    credentials: 'omit' // in case CORS wildcard headers are present
  }).then(response => {
    if (!response.ok) {
      return caches.match(FALLBACK_IMAGE_URL, { cacheName: ALL_CACHES.fallbackImages });
    } else {
      return response;
    }
  }).catch(error => {
    console.error(error);
    return caches.match(FALLBACK_IMAGE_URL, { cacheName: ALL_CACHES.fallbackImages });
  })
}

self.addEventListener('fetch', event => {
  let acceptHeader = event.request.headers.get('accept');
  let requestUrl = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request, {cacheName: ALL_CACHES.prefetch}).then((response) => {
      // If a precached thing is found, go with it
      if (response) return response;
      // Otherwise, let's dig deeper
      if (acceptHeader.indexOf('image/*') >= 0) {
        if (requestUrl.pathname.indexOf('/images/') === 0) {
          return fetchImageOrFallback(event);
        }
      }
      return fetch(event.request);
    })
  )
});