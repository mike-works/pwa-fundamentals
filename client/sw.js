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

/**
 * @return {Promise<Response>}
 */
function fetchApiJsonWithFallback() {
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
    caches.match(event.request, {cacheName: ALL_CACHES.prefetch}).then((response) => {
      // If a precached thing is found, go with it
      if (response) return response;
      // Otherwise, let's dig deeper
      if (isGroceryImage) {
        return fetchImageOrFallback(event);
      } else if (isApiJson) {
        return fetchApiJsonWithFallback(event);
      }
      return fetch(event.request);
    })
  )
});