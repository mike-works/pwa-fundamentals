import { precacheStaticAssets, ALL_CACHES, removeUnusedCaches } from '../sw/caches';

let counts = {
  install: 0,
  activate: 0,
  fetch: 0
};

const FALLBACK_IMAGE_CACHE_NAME = 'fallback-images-1';
const FALLBACK_GROCERY_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';

function timeout(n) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(`Timed out after ${n}ms`), n);
  });
}

self.addEventListener('install', /** @type {ExtendableEvent} */(evt) => {
  console.log('installing', counts.install++);
  evt.waitUntil( // Don't finish install until this is done
    Promise.all([
      //1. Open the correct cache (creates if doesn't exist)
      caches.open(FALLBACK_IMAGE_CACHE_NAME).then(cache => {
        // Add the generic grocery fallback to the cache
        return cache.add(FALLBACK_GROCERY_IMAGE_URL)
      }),
      // 2. 
      Promise.race([precacheStaticAssets().then(d => {
        console.log("PRECACHE SUCCESS!");
        return d;
      }), timeout(5000)])
    ])
  );
});

self.addEventListener('activate', evt => {
  console.log('activating', counts.activate++);
  // self.clients.claim();
});

const GROCERY_IMAGE_URL_REGEX = /https:\/\/localhost:3100\/images\/[0-9]+.jpg/;
/**
 * @returns {Promise<Response>}
 */
function genericGroceryImageResponse() {
  // part 0 solution
  // return fetch(FALLBACK_GROCERY_IMAGE_URL); 
  return caches.open(FALLBACK_IMAGE_CACHE_NAME).then(cache => {
    return cache.match(FALLBACK_GROCERY_IMAGE_URL);
  });
}

/**
 * 
 * @param {RequestInfo} requestInfo 
 * @param {RequestInit} requestOptions 
 * @returns {Promise<Response>}
 */
function fetchAndCache(requestInfo, requestOptions) {
  return fetch(requestInfo, requestOptions).then(resp => {
    let response = resp.clone();
    if (response.ok) {
      caches.open(ALL_CACHES.fallback).then(cache => {
        cache.put(requestInfo, response);
      })
    }
    return resp;
  })
}

/**
 * @param {FetchEvent} evt
 * @return {Promise<Response>}
 */
function handleGroceryImageRequest(evt) {
  let req = evt.request;
  // 404 HACK -- damage the url for 54.jpg
  if (evt.request.url.endsWith('/images/54.jpg')) {
    req = evt.request.url.replace('54', 'NOT_FOUND');
  }
  // Try the original request
  let attempt = fetchAndCache(req, { mode: 'cors' })
    .then(resp => { // A - Request completed
      // Fetch for grocery image worked!
      if (resp.ok) return resp;
      // Fetch for grocery image: 4xx, 5xx status code
      return genericGroceryImageResponse();
    })
    .catch(e => { // B - Couldn't complete request
      return genericGroceryImageResponse();
    });
  let timeout = new Promise(res => {
    setTimeout(() => {
      genericGroceryImageResponse().then(resp => {
        res(resp);
      });
    }, 1000);
  });
  return Promise.race([timeout, attempt]);
}

self.addEventListener('activate', evt => {
  evt.waitUntil(removeUnusedCaches([FALLBACK_IMAGE_CACHE_NAME, ALL_CACHES.prefetch]))
})


self.addEventListener('fetch', evt => {
  let { request } = evt;
  let acceptHeader = request.headers.get('accept');
  let isHTMLRequest = request.headers.get('accept').indexOf('text/html') >= 0;
  let isLocal = new URL(request.url).origin === location.origin;
  // VERY COMMON to have a lot of booleans that look like this
  // IF the accept header looks like it's for an image
  //    (thanks <img src=?> !)
  let isImage = acceptHeader.indexOf('image/*') >= 0;
  // Not just any image, but one that matches the 
  //  grocery image regex
  let isGroceryImage = 
    isImage && GROCERY_IMAGE_URL_REGEX.test(evt.request.url);
    
  /**
   * Kick out to our single-purpose functions for various
   * types of resources. Never put the logic for a resource
   * type here directly.
   */
  if (isHTMLRequest && isLocal) {
    //TODO: Respond with html from cache
  } else if (isGroceryImage) { // If it's a grocery image
    evt.respondWith(handleGroceryImageRequest(evt));
  } else {
    evt.respondWith(
      caches.open(ALL_CACHES.prefetch).then(cache => {
        return cache.match(evt.request).then(resp => {
          if (resp) return resp;
          console.log('NOT CACHED ->', evt.request.url);
          return fetchAndCache(evt.request); 
        })
      })
    );
  }
  // else network
});