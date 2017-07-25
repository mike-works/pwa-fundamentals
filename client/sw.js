/* eslint no-console: 0 */
import { cleanUnusedCaches, prefetchStaticAssets, handleIfPrecached, fetchWithCacheFallback } from './sw/caches';

const INDEX_HTML_PATH = '/';
const INDEX_HTML_URL = new URL(INDEX_HTML_PATH, self.location).toString();

function shouldPassThrough(url) {
  return (url.indexOf('sockjs-node/info') >= 0) || (url.indexOf('chrome-extension') >= 0);
}

self.addEventListener('install', (event) => {
  event.waitUntil(prefetchStaticAssets());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(cleanUnusedCaches());
});

self.addEventListener('notificationclick', function(event) {
  // event.notification.close();
  // event.notification
  console.log(event);
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(self.clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      // if (client.url == 'https://localhost:3000')
      return client.focus();
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow('https://localhost:3000');
    }
  }
  ));
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
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (self.clients.openWindow)
      return self.clients.openWindow('/');
  }));
});


self.addEventListener('push', (event) => {
  if (event.data.text() === 'terminate') {
    self.registration.unregister().then((didUnregister) => {
      console.log('Service worker unregistered; ', didUnregister);
    });
  }
  let eventData = event.data.json();
  // let notification = new Notification();
  // notification.onclick = function() {
  //   event.preventDefault(); // prevent the browser from focusing the Notification's tab
  //   window.open('http://www.mozilla.org', '_blank');
  // }
  self.registration.showNotification(eventData.notification.title, {
    body: eventData.notification.body,
    icon: '/img/launcher-icon-2x.png'
  });
});

self.addEventListener('fetch', (event) => {
  let request = event.request;
  let isGETRequest = request.method === 'GET';
  let isHTMLRequest = request.headers.get('accept').indexOf('text/html') !== -1;
  let isLocal = new URL(request.url).origin === location.origin;
  if (isGETRequest && !shouldPassThrough(request.url)) {
    if (isHTMLRequest && isLocal) {
      console.info('SW: HTML request: ', request.url);
      event.respondWith(
        fetch(event.request).catch(() => caches.match(INDEX_HTML_URL))
      );
    } else {
      event.respondWith(
        handleIfPrecached(event.request)
          .catch(() => {
            return fetchWithCacheFallback(event.request, 400)
              .catch((err) => {
                console.info('Failed: ', event.request.url, err);
                return fetch(event.request.url);
              });
          })
      );
    }
  } else {
    return fetch(event.request);
  }
});
