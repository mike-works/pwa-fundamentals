const FALLBACK_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';

const FALLBACK_IMAGES = 'fallback-images';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(FALLBACK_IMAGES).then(cache => {
      return cache.add(FALLBACK_IMAGE_URL)
    })
  );
});

self.addEventListener('activate', () => {

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

self.addEventListener('fetch', event => {
  let acceptHeader = event.request.headers.get('accept');
  let requestUrl = new URL(event.request.url);
  let isGroceryImage = acceptHeader.indexOf('image/*') >= 0 && requestUrl.pathname.indexOf('/images/') === 0;

  if (acceptHeader && isGroceryImage) {
    event.respondWith(
      fetchImageOrFallback(event)
    );
  }
});
