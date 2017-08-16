self.addEventListener('install', installEvt => {
  installEvt.waitUntil(
    caches.open('fallback-v1').then(cache => {
      return cache.add('https://localhost:3100/images/fallback-grocery.png')
    })
  );
});

// self.addEventListener('activate', activateEvt => {
//   console.log('activate', counts.activate++);
// });

function fetchWithTimeout(req, options, backup, timeout=100) {
  return new Promise((resolve, reject) => {
    fetch(req, { mode: 'cors' }).then((response) => {
      debugger;
      clearTimeout(task);
      return resolve(response);
    });
    let task = setTimeout(() => {
      debugger;
      resolve(backup());
    }, timeout);
  })
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
  if (isGet) {
    if (isGroceryImage) {
      fetchEvt.respondWith(
        fetchWithTimeout(
          request,
          { mode: 'cors' },
          () => caches.match('https://localhost:3100/images/fallback-grocery.png')
        ).then(response => {
          return response.ok
            ? response
            : caches.match('https://localhost:3100/images/fallback-grocery.png')
        })
      )
    }
  }
});