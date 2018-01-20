import { precacheStaticAssets, ALL_CACHES, removeUnusedCaches } from '../sw/caches';
import idb from 'idb';

let counts = {
  install: 0,
  activate: 0,
  fetch: 0
};

const FALLBACK_IMAGE_CACHE_NAME = 'fallback-images-1';
const FALLBACK_GROCERY_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';

function timeout(n) {
  let task;
  let p = new Promise((_, reject) => {
    task = setTimeout(() => {
      throw new Error(`Timed out after ${n}ms`);
    }, n);
  });
  p.clear = function() {
    console.log('Ticking clock has stopped');
    clearTimeout(task);
  }
  return p;
}

function getDb() {
  return idb.open('GrocerDb', 1, upgrade => {
    // upgrade it
    switch (upgrade.oldVersion) {
      case 0:
        upgrade.createObjectStore('groceryItems', { keyPath: 'id'});
    }
  });
}

/**
 * @returns {Promise<any>}
 */
function populateGroceryItemDb() {
  // open (create if needed) database
  let dataUrl = 'https://localhost:3100/api/grocery/items?limit=99999';
  let groceryItems;
  return fetch(dataUrl)
    .then(resp => resp.json())
    .then(({ data: items }) => {
      groceryItems = items;
      return getDb()
    })
    .then(db => {
      let tx = db.transaction('groceryItems','readwrite');
      let store = tx.objectStore('groceryItems');
      return Promise.all(groceryItems.map(i => store.put(i)));
    });
}

function precacheGroceryFallbackImages() {
  return caches.open(FALLBACK_IMAGE_CACHE_NAME).then(cache => {
    return cache.addAll(['bakery', 'dairy', 'frozen', 'fruit', 'herbs', 'meat', 'vegetables', 'grocery']
      .map(n => `https://localhost:3100/images/fallback-${n}.png`))
  })
}

self.addEventListener('install', /** @type {ExtendableEvent} */(evt) => {
  console.log('installing', counts.install++);
  let time = timeout(5000);
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
        time.clear();
        return d;
      }), time]),
      // 3. Populate indexedDb with grocery item data
      populateGroceryItemDb(),
      // 4. PrecacheGroceryFallback
      precacheGroceryFallbackImages()
    ])
  );
});

self.addEventListener('activate', evt => {
  console.log('activating', counts.activate++);
  // self.clients.claim();
});

const GROCERY_IMAGE_URL_REGEX = /https:\/\/localhost:3100\/images\/([0-9]+).jpg/;
/**
 * @returns {Promise<Response>}
 */
function genericGroceryImageResponse(groceryItemId) {
  // part 0 solution
  // return fetch(FALLBACK_GROCERY_IMAGE_URL); 
  ////// ONE FALLBACK FOR ALL
  // return caches.open(FALLBACK_IMAGE_CACHE_NAME).then(cache => {
  //   return cache.match(FALLBACK_GROCERY_IMAGE_URL);
  // });
  return getDb().then(db => {
    let tx = db.transaction('groceryItems','readwrite');
    let store = tx.objectStore('groceryItems');
    return store.get(parseInt(groceryItemId, 10)).then(groceryItem => {
      let cat = groceryItem.category.toLowerCase();
      return caches.open(FALLBACK_IMAGE_CACHE_NAME).then(cache => {
        return cache.match(FALLBACK_GROCERY_IMAGE_URL.replace('grocery', cat));
      });
    })
  })
}

self.addEventListener('push', (evt) => {
  let pushData = evt.data;
  console.log('received push', pushData.text());
  let { notification } = pushData.json();
  self.registration.showNotification(notification.title, {
    icon: 'https://localhost:3000/img/launcher-icon-1x.png',
    tag: 'order-status',
    renotify: true
  });
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(self.clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == 'https://localhost:3000/' && 'focus' in client)
        return client.focus();
    }
    if (self.clients.openWindow)
      return self.clients.openWindow('https://localhost:3000/');
  }));
});

/**
 * 
 * @param {RequestInfo} requestInfo 
 * @param {RequestInit} requestOptions 
 * @returns {Promise<Response>}
 */
function fetchAndCache(requestInfo, requestOptions) {
  return fetch(requestInfo, requestOptions).then(resp => {
    let response = resp.clone();
    if (resp.ok) {
      caches.open(ALL_CACHES.fallback).then(cache => {
        cache.put(requestInfo, response);
      })
    }
    return resp;
  })
  .catch(() => {
    return caches.open(ALL_CACHES.fallback)
      .then(cache => cache.match(requestInfo))
  })
}

/**
 * @param {FetchEvent} evt
 * @return {Promise<Response>}
 */
function handleGroceryImageRequest(evt) {
  let req = evt.request;
  let groceryId = GROCERY_IMAGE_URL_REGEX.exec(evt.request.url)[1];
  console.log("FALLBACK FOR ", groceryId);
  // 404 HACK -- damage the url for 54.jpg
  // if (evt.request.url.endsWith('/images/54.jpg')) {
  //   req = evt.request.url.replace('54', '09127486912');
  // }
  // Try the original request
  let attempt = fetchAndCache(req, { mode: 'cors' })
    .then(resp => { // A - Request completed
      // Fetch for grocery image worked!
      if (resp.ok) return resp;
      // Fetch for grocery image: 4xx, 5xx status code
      return genericGroceryImageResponse(groceryId);
    })
    .catch(e => { // B - Couldn't complete request
      return genericGroceryImageResponse(groceryId);
    });
  let timeout = new Promise(res => {
    setTimeout(() => {
      genericGroceryImageResponse(groceryId).then(resp => {
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
    evt.respondWith(
      caches.open(ALL_CACHES.prefetch).then(cache =>{
        return cache.match('/').then(cacheResp => {
          return fetch(evt.request.url).then(fetchResp => {
            if (fetchResp.ok) {
              console.log('🎉 html network OK');
              return fetchResp
            } else {
              console.log('🎉 html network NOT OK');
              return cacheResp;
            }
          }).catch(() => {
            console.log('🎉 html network failed');
            return cacheResp
          });
        })
      })
    );
  } else if (isGroceryImage) { // If it's a grocery image
    evt.respondWith(handleGroceryImageRequest(evt));
  } else {
    evt.respondWith(
      // prefetch check
      caches.open(ALL_CACHES.prefetch).then(cache => {
        return cache.match(evt.request).then(prefetchResp => {
          if (prefetchResp) return prefetchResp;
          console.log('NOT PREFETCH CACHED ->', evt.request.url);
          return fetchAndCache(evt.request); 
        })
      })
    );
  }
  // else network
});