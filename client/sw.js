import { precacheStaticAssets, removeUnusedCaches, ALL_CACHES, ALL_CACHES_LIST } from './sw/caches';
import idb from 'idb';

const FALLBACK_IMAGE_URLS = ['grocery', 'bakery', 'dairy', 'frozen', 'fruit', 'herbs', 'meat', 'vegetables']
  .map(name => `https://localhost:3100/images/fallback-${name}.png`);
const FALLBACK_IMAGES = ALL_CACHES.fallbackImages;

const INDEX_HTML_PATH = '/';
const INDEX_HTML_URL = new URL(INDEX_HTML_PATH, self.location).toString();

function groceryItemDb() {
  return idb.open('groceryitem-store', 1, upgradeDb => {
    switch(upgradeDb.oldVersion) {
    // deliberately allow fall-through case blocks
    case 0:
      // initial setup
      upgradeDb.createObjectStore('grocery-items', { keyPath: 'id' });
    }
  })
}

/**
 * @return {Promise}
 */
function downloadGroceryItems() {
  groceryItemDb().then(db => {
    fetch('https://localhost:3100/api/grocery/items?limit=99999')
      .then(response => response.json())
      .then( ({ data: groceryItems }) => {
        let tx = db.transaction('grocery-items', 'readwrite');
        tx.objectStore('grocery-items').clear();
        return tx.complete.then(() => {
          let txx = db.transaction('grocery-items', 'readwrite');
          let store = txx.objectStore('grocery-items');
          groceryItems.forEach(groceryItem => store.put(groceryItem));
          return txx.complete;
        });
      })
  })
}

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Get the fallback image
      caches.open(FALLBACK_IMAGES).then(cache => {
        return cache.addAll(FALLBACK_IMAGE_URLS)
      }),
      // Populate the precache stuff
      precacheStaticAssets(),
      // Populate IndexedDb with grocery items
      downloadGroceryItems()
    ])
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    removeUnusedCaches(ALL_CACHES_LIST)
  );
});

function fallbackImageForRequest(request) {
  let url = new URL(request.url);
  let pathName = url.pathname;
  let itemId = parseInt(pathName.substring(pathName.lastIndexOf('/') + 1, pathName.lastIndexOf('.')), 10);
  return groceryItemDb().then(db => {
    let tx = db.transaction('grocery-items');
    let store = tx.objectStore('grocery-items');
    return store.get(itemId);
  }).then(groceryItem => {
    let { category } = groceryItem;
    return caches.match(`https://localhost:3100/images/fallback-${category.toLowerCase() || 'grocery'}.png`, { cacheName: FALLBACK_IMAGES})
  })
}

function fetchImageOrFallback(fetchEvent) {
  return fetch(fetchEvent.request, {mode: 'cors'})
    .then((response) => {
      let responseClone = response.clone();
      if (!response.ok){
        return fallbackImageForRequest(fetchEvent.request);
      }
      caches.open(ALL_CACHES.fallback).then(cache => {        
        // Successful response
        if (response.ok) {
          // Begin the process of adding the response to the cache
          cache.put(fetchEvent.request, responseClone);
        }
      })
      return response;
    })
    .catch(() => {
      return caches.match(fetchEvent.request, {cacheName: ALL_CACHES.fallback}).then(response => {
        return response || fallbackImageForRequest(fetchEvent.request);
      });
    })
}

/**
 * @return {Promise<Response>}
 */
function fetchApiJsonWithFallback(fetchEvent) {
  return caches.open(ALL_CACHES.fallback).then((cache) => {
    return fetch(fetchEvent.request)
      .then(response => {
        // Clone the response so we can return one and store one
        let responseClone = response.clone();
        // Successful response
        if (response.ok) {
          // Begin the process of adding the response to the cache
          cache.put(fetchEvent.request, responseClone);
        }
        // Return the original response
        return response;
      })
      .catch(() => {
        return cache.match(fetchEvent.request);
      })
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
  let isFromApi = requestUrl.origin.indexOf('localhost:3100') >= 0;
  let isHTML = event.request.headers.get('accept').indexOf('text/html') !== -1;
  let isLocal = new URL(event.request.url).origin === location.origin;

  if (isHTML && isLocal) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(INDEX_HTML_URL, { cacheName: ALL_CACHES.prefetch}))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { cacheName: ALL_CACHES.prefetch })
      .then(response => {
        // Cache hit! Return the precached response
        if (response) return response;
        // Handle grocery images
        if (acceptHeader && isGroceryImage) {
          return fetchImageOrFallback(event)
        } else if (isFromApi && event.request.method === 'GET') {
          return  fetchApiJsonWithFallback(event)
        } else {
          // Everything else falls back to the network
          return fetch(event.request);
        }
      })
  );
});
