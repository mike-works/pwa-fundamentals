/* eslint no-console: 0 */
import { cleanUnusedCaches, prefetchStaticAssets, cacheFallback }  from './sw/caches';

function isHtmlRequest(request) {
  let r = request.headers.get('accept').indexOf('text/html') >= 0;
  console.info('HTML?', request.url, r);
  return r;
}

self.addEventListener('install', (event) => {
  event.waitUntil(prefetchStaticAssets());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(cleanUnusedCaches());
});

// self.addEventListener('fetch', (event) => {

// });
