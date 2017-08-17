import { ALL_CACHES, ALL_CACHES_LIST, precacheStaticAssets, removeUnusedCaches } from './sw/caches';

const INDEX_HTML_PATH = '/';
const INDEX_HTML_URL = new URL(INDEX_HTML_PATH, self.location).toString();

self.addEventListener('install', installEvt => {
  installEvt.waitUntil(
    Promise.all([
      caches.open(ALL_CACHES.fallbackImages).then(cache => {
        return cache.add('https://localhost:3100/images/fallback-grocery.png')
      }),
      precacheStaticAssets()
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
  //TODO
}

/**
 * 
 * @param {string} url 
 * @return {Promise<Response>} grocery image fallback response
 */
function respondWithGroceryFallback(url) {
  return {hello: 'world'};//caches.match('https://localhost:3100/images/fallback-grocery.png');
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

function respondWithApiJson(fetchEvt) {
  return fetch(fetchEvt.request)
    .then(resp => {
      if (resp.ok) { // 200
        let respClone = resp.clone();
        return caches.open(ALL_CACHES.fallback)
          .then(cache => cache.put(fetchEvt.request, respClone))
          .then(() => resp); // return to app
      } else return resp; // 500, 404, return to app
    })
    .catch(() => { // no network connection
      return caches.match(fetchEvt.request, { cacheName: ALL_CACHES.fallback });
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