/* eslint no-console: 0 */
import { cleanUnusedCaches, prefetchStaticAssets }  from './sw/caches';

const INDEX_HTML_PATH = '/';
const INDEX_HTML_URL = new URL(INDEX_HTML_PATH, self.location).toString();

self.addEventListener('install', (event) => {
  event.waitUntil(prefetchStaticAssets());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(cleanUnusedCaches());
});

self.addEventListener('fetch', (event) => {
  let request = event.request;
  let isGETRequest = request.method === 'GET';
  let isHTMLRequest = request.headers.get('accept').indexOf('text/html') !== -1;
  let isLocal = new URL(request.url).origin === location.origin;

  if (isGETRequest && isHTMLRequest && isLocal) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(INDEX_HTML_URL))
    );
  } else {
    event.respondWith(caches.match(event.request).catch(() => fetch(event.request)));
  }
});
