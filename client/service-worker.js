import { ALL_CACHES, ALL_CACHES_LIST, precacheStaticAssets, removeUnusedCaches } from './sw/caches';
import { getDb } from './data/db';

const INDEX_HTML_PATH = '/';
const INDEX_HTML_URL = new URL(INDEX_HTML_PATH, self.location).toString();

function populateGroceryItemsInDB() {
  fetch('https://localhost:3100/api/grocery/items?limit=99999')
    .then(response => response.json())
    .then(({ data: groceryItems }) => {
      return getDb().then(db => {
        let tx = db.transaction('grocery-items', 'readwrite');
        let store = tx.objectStore('grocery-items');
        return Promise.all(
          groceryItems.map(gi => store.put(gi))
        );
      });
    });
}

self.addEventListener('install', installEvt => {
  installEvt.waitUntil(
    Promise.all([
      caches.open(ALL_CACHES.fallbackImages).then(cache => {
        return cache.addAll(['fruit', 'herbs', 'bakery', 'dairy', 'vegetables', 'meat']
          .map(cat => `https://localhost:3100/images/fallback-${cat}.png`)
        );
      }),
      precacheStaticAssets(),
      populateGroceryItemsInDB()
    ])
  );
});

self.addEventListener('activate', activateEvt => {
  activateEvt.waitUntil(
    removeUnusedCaches(ALL_CACHES_LIST)
  )
});

function fetchWithTimeout(req, options, backup, timeout=10000) {
  return new Promise((resolve, reject) => {
    fetch(req, { mode: 'cors' }).then((response) => {
      clearTimeout(task);
      return resolve(response);
    });
    let task = setTimeout(() => {
      resolve(backup());
    }, timeout);
  })
}

function getGroceryCategoryFromUrl(url) {
  // '/images/148.jpg'
  let lastSlash = url.lastIndexOf('/');
  let lastDot = url.lastIndexOf('.');
  let idString = url.substring(lastSlash + 1, lastDot);
  let id = parseInt(idString, 10);
  return getDb().then(db => {
    let tx = db.transaction('grocery-items', 'readonly');
    let store = tx.objectStore('grocery-items');
    return store.get(id)
      .then(g => g.category);
    // return store.get(id)
    //   .then(record => {
    //     return record ? record.category : 'grocery'
    //   });
  });
}

/**
 * 
 * @param {string} url 
 * @return {Promise<Response>} grocery image fallback response
 */
function respondWithGroceryFallback(url) {
  return getGroceryCategoryFromUrl(url)
    .then(category => {
      return caches.match(`https://localhost:3100/images/fallback-${category.toLowerCase()}.png`);
    });
}

function respondWithGroceryImage(fetchEvt) {
  return fetch(
    fetchEvt.request,
    { mode: 'cors' }//,
    // () => caches.match('https://localhost:3100/images/fallback-grocery.png')
  ).then(response => {
    if (response.ok) {
      let respClone = response.clone();
      return caches.open(ALL_CACHES.fallback)
        .then(cache => cache.put(fetchEvt.request, respClone))
        .then(() => response); // return to app
    }
    else{
      return respondWithGroceryFallback(fetchEvt.request.url);
    } 
  });
}

function getGroceryImage(fetchEvt) {
  return respondWithGroceryImage(fetchEvt)
    .catch(() => {
      return caches.match(fetchEvt.request, { cacheName: ALL_CACHES.fallback }).then(resp => {
        return resp ||  respondWithGroceryFallback(fetchEvt.request.url);
      });
    });
}

/**
 * 
 * @param {URL} url 
 */
function getQueryParamsFromUrl(url) {
  return url.search // ?a=b&c=d
    .substring(1) // leave out the leading ?
    .split('&') // break into key-value pairs
    .map(kvPair => kvPair.split('=')) // "key=val" => ['key', 'val']
    .reduce((hash, pair) => { // [['key', 'val']] => {key: 'val}
      hash[pair[0]] = pair[1];
      return hash;
    }, {});
}

/**
 * 
 * @param {string} urlString 
 */
function generateGroceryItemJson(urlString) {
  /*
    we'll arrrive here if we're being asked
    for grocery item json that we didn't cache
    by seeing it in a previous fetch
  */
  let url = new URL(urlString);
  // Unless we're dealing with this API endpoint, forget it
  if (url.pathname !== '/api/grocery/items') return null;

  return getDb().then(db => {
    let tx = db.transaction('grocery-items', 'readonly');
    let store = tx.objectStore('grocery-items');
    let qp = getQueryParamsFromUrl(url);
    let catIdx = store.index('categoryIndex');
    debugger;
    return catIdx.getAll(qp.category, qp.limit || 10)
      .then(catItems => {
        return new Response(
          JSON.stringify(
            {data: catItems}
          )
        );
      });
  });
}

function respondWithApiJson(fetchEvt) {
  let { request } = fetchEvt;
  return fetch(request)
    .then(resp => {
      if (resp.ok) { // 200
        let respClone = resp.clone();
        return caches.open(ALL_CACHES.fallback)
          .then(cache => cache.put(request, respClone))
          .then(() => resp); // return to app
      } else return resp; // 500, 404, return to app
    })
    .catch(() => { // no network connection
      return caches.match(request, { cacheName: ALL_CACHES.fallback })
        .then((resp) => {
          if (resp) return resp;
          else return generateGroceryItemJson(request.url);
        });
    })
}

function handleIndexHTML(fetchEvent) {
  return fetch(fetchEvent.request).catch(() => {
    return caches.match('/')
  });
}

self.addEventListener('fetch', fetchEvt => {
  let { request } = fetchEvt;
  // Get the Accept header from the request
  let acceptHeader = request.headers.get('accept');
  // Build a URL object from the request's url string
  let requestUrl = new URL(request.url);
  // is a GET request
  let isGet = request.method === 'GET';

  let isGroceryImage = 
    acceptHeader.indexOf('image/*') >= 0 && // if it's an image
    requestUrl.pathname.indexOf('/images/') === 0;

  let isApiJSON = requestUrl.pathname.startsWith('/api/');

  let isHTMLRequest = request.headers.get('accept').indexOf('text/html') !== -1;
  let isLocal = new URL(request.url).origin === location.origin;

  if (isGet) {

    if (isHTMLRequest && isLocal) {
      fetchEvt.respondWith(handleIndexHTML(fetchEvt));
      return;
    }

    fetchEvt.respondWith(
      //
      caches.match(request, { cacheName: ALL_CACHES.prefetch }).then(resp => {
        if (resp) return resp; // precache
        else if (isGroceryImage) {
          // grocery images
          return getGroceryImage(fetchEvt);
        } else if (isApiJSON) {
          return respondWithApiJson(fetchEvt);
        } else {
          // all other things
          return fetch(fetchEvt.request);
        }
      })
      //
    );
  }
});