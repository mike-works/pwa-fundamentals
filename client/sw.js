import { precacheStaticAssets, removeUnusedCaches, ALL_CACHES, ALL_CACHES_LIST } from './sw/caches.js';
import idb from 'idb';

const FALLBACK_IMAGE_URLS = [
  'https://localhost:3100/images/fallback-grocery.png',
  'https://localhost:3100/images/fallback-bakery.png',
  'https://localhost:3100/images/fallback-dairy.png',
  'https://localhost:3100/images/fallback-frozen.png',
  'https://localhost:3100/images/fallback-fruit.png',
  'https://localhost:3100/images/fallback-herbs.png',
  'https://localhost:3100/images/fallback-meat.png',
  'https://localhost:3100/images/fallback-vegetables.png'
];

const INDEX_HTML_PATH = '/';
const INDEX_HTML_URL = new URL(INDEX_HTML_PATH, self.location).toString();

function groceryItemDb() {
  return idb.open('groceryitem-store', 1, upgradeDb => {
    switch(upgradeDb.oldVersion) {
    case 0: upgradeDb.createObjectStore('grocery-items', {keyPath: 'id'});
    }
  })
}

function downloadGroceryItems() {
  return groceryItemDb().then(db => {
    fetch('https://localhost:3100/api/grocery/items?limit=99999')
      .then((response) => response.json())
      .then(({ data: groceryItems }) => {
        let tx = db.transaction('grocery-items', 'readwrite');
        tx.objectStore('grocery-items').clear();
        tx.complete.then(() => {
          let txx = db.transaction('grocery-items', 'readwrite');
          groceryItems.forEach((groceryItem) => {
            txx.objectStore('grocery-items').put(groceryItem);            
          });
          return txx.complete;
        });
      })
  })
}

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // get the fallback image
      caches.open(ALL_CACHES.fallbackImages)
        .then(cache => {
          cache.addAll(FALLBACK_IMAGE_URLS);
        }),
      // populate the precache stuff
      precacheStaticAssets(),
      // populate IndexedDb with grocery-items
      downloadGroceryItems()
    ])
  )
});

self.addEventListener('activate', (event) => {
  // caches.keys().then(cacheNames => {})
  event.waitUntil(
    removeUnusedCaches(ALL_CACHES_LIST)
  )
});

function fallbackImageForRequest(request) {
  let path = new URL(request.url).pathname;
  //   /images/123.png 
  let itemId = parseInt(path.substr(path.lastIndexOf('/') + 1, path.lastIndexOf('.')), 10);
  
  return groceryItemDb().then(db => {
    return db
      .transaction('grocery-items')
      .objectStore('grocery-items')
      .get(itemId);
  }).then((groceryItem) => {
    let { category } = groceryItem;
    return caches.match(`https://localhost:3100/images/fallback-${category.toLowerCase()}.png`, { cacheName: ALL_CACHES.fallbackImages });
  });
}

function fetchImageOrFallback(fetchEvent) {
  return fetch(fetchEvent.request, { 
    mode: 'cors',
    credentials: 'omit' // in case CORS wildcard headers are present
  }).then(response => {
    if (!response.ok) {
      return fallbackImageForRequest(fetchEvent.request);      
    } else {
      return response;
    }
  }).catch(error => {
    console.error(error);
    return fallbackImageForRequest(fetchEvent.request);
  })
}

/**
 * @return {Promise<Response>}
 */
function fetchApiDataWithFallback(fetchEvent) {
  return caches.open(ALL_CACHES.fallback).then((cache) => {
    return fetch(fetchEvent.request)
      .then((response) => {
        // Clone response so we can return one and store one
        let clonedResponse = response.clone();
        // Put the clonedResponse and request in the cache
        cache.put(fetchEvent.request, clonedResponse);
        // Return the original
        return response;
      })
      .catch(() => {
        return cache.match(fetchEvent.request);
      })
    // cache.add or addAll (request or url)
    // try to go to the network for some json
    //   when it comes back, begin the process of putting it in the cache
    //   and resolve the promise with the original response 
    // in the event that it doesn't work out
    // serve from the cache
  });
}

self.addEventListener('push', event => {
  let { data } = event;
  let textData = data.text();
  if (textData === 'TERMINATE') {
    self.registration.unregister();
    return;
  }
}); 

self.addEventListener('fetch', event => {
  let acceptHeader = event.request.headers.get('accept');
  let requestUrl = new URL(event.request.url);

  let isGroceryImage = acceptHeader.indexOf('image/*') >= 0 && requestUrl.pathname.indexOf('/images/') === 0;
  let isFromApi = requestUrl.origin.indexOf('localhost:3100') >= 0;

  let isHTMLRequest = event.request.headers.get('accept').indexOf('text/html') !== -1;
  let isLocal = new URL(event.request.url).origin === location.origin;

  if (isHTMLRequest && isLocal) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(INDEX_HTML_URL, {cacheName: ALL_CACHES.prefetch})         
        })
    )
    return;
  }

  event.respondWith(
    caches.match(event.request, {cacheName: ALL_CACHES.prefetch}).then((response) => {
      // If a precached thing is found, go with it
      if (response) return response;
      // Otherwise, let's dig deeper
      if (isGroceryImage) {
        return fetchImageOrFallback(event);
      } else if (isFromApi) {
        return fetchApiDataWithFallback(event);
      }
      return fetch(event.request);
    })
  )
});