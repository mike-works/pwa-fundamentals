import { precacheStaticAssets, removeUnusedCaches, ALL_CACHES, ALL_CACHES_LIST } from './sw/caches';

const FALLBACK_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';
const FALLBACK_IMAGES = ALL_CACHES.fallbackImages;

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Get the fallback image
      caches.open(FALLBACK_IMAGES).then(cache => {
        return cache.add(FALLBACK_IMAGE_URL)
      }),
      // Populate the precache stuff
      precacheStaticAssets()
    ])
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    removeUnusedCaches(ALL_CACHES_LIST)
  );
});

function fetchImageOrFallback(fetchEvent) {
  return fetch(fetchEvent.request, {mode: 'cors'})
    .then((response) => {
      if (!response.ok){
        return caches.match(FALLBACK_IMAGE_URL, { cacheName: FALLBACK_IMAGES});
      }
      return response;
    })
    .catch(() => caches.match(FALLBACK_IMAGE_URL, { cacheName: FALLBACK_IMAGES}));
}

/**
 * @return {Promise<Response>}
 */
function fetchApiJsonWithFallback(/* fetchEvent */) {
  return caches.open(ALL_CACHES.fallback).then((/* cache */) => {
    // cache.add or addAll (request or url)
  })

  // try to go to the network for some json
  //   when it comes back, begin the process of putting it in the cache
  //   and resolve the promise with the original response 
  // in the event that it doesn't work out
  // serve from the cache
}

self.addEventListener('fetch', event => {
  let acceptHeader = event.request.headers.get('accept');
  let requestUrl = new URL(event.request.url);
  let isGroceryImage = acceptHeader.indexOf('image/*') >= 0 && requestUrl.pathname.indexOf('/images/') === 0;
  let isApiJson = false;
  event.respondWith(
    caches.match(event.request, { cacheName: ALL_CACHES.prefetch })
      .then(response => {
        // Cache hit! Return the precached response
        if (response) return response;
        // Handle grocery images
        if (acceptHeader && isGroceryImage) {
          return fetchImageOrFallback(event)
        } else if (isApiJson) {
          return  fetchApiJsonWithFallback(event)
        } else {
          // Everything else falls back to the network
          return fetch(event.request);
        }
      })
  );
});
