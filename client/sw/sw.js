let counts = {
  install: 0,
  activate: 0,
  fetch: 0
};

self.addEventListener('install', evt => {
  console.log('installing', counts.install++);
  // self.skipWaiting();

});

self.addEventListener('activate', evt => {
  console.log('activating', counts.activate++);
  // self.clients.claim();
});

const GROCERY_IMAGE_URL_REGEX = /https:\/\/localhost:3100\/images\/[0-9]+.jpg/;
const FALLBACK_GROCERY_IMAGE_URL = 'https://localhost:3100/images/fallback-grocery.png';
/**
 * @returns {Promise<Response>}
 */
function genericGroceryImageResponse() {
  return fetch(FALLBACK_GROCERY_IMAGE_URL); 
}

/**
 * @param {FetchEvent} evt
 * @return {Promise<Response>}
 */
function handleGroceryImageRequest(evt) {
  let req = evt.request;
  if (evt.request.url.endsWith('/images/54.jpg')) {
    req = evt.request.url.replace('54', 'NOT_FOUND');
  }
  return fetch(req, { mode: 'cors' })
    .then(resp => { // A - Request completed
      // Fetch for grocery image worked!
      if (resp.ok) return resp;
      // Fetch for grocery image: 4xx, 5xx status code
      return genericGroceryImageResponse();
    })
    .catch(e => { // B - Couldn't complete request
      return genericGroceryImageResponse();
    });
}


self.addEventListener('fetch', evt => {
  let acceptHeader = evt.request.headers.get('accept');
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
   * type here directly
   */
  if (isGroceryImage) { // If it's a grocery image
    evt.respondWith(handleGroceryImageRequest(evt));
  } // else if (isJSON) 
  // else if (isIndexDotHTML)
  // Else 
});