import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './app';
import VAPID from './../.vapid.json';

import 'file-loader?name=web-app-manifest.json!./web-app-manifest.json';
import 'file-loader?name=./img/launcher-icon-1x.png!./img/launcher-icon-1x.png';
import 'file-loader?name=./img/launcher-icon-2x.png!./img/launcher-icon-2x.png';
import 'file-loader?name=./img/launcher-icon-4x.png!./img/launcher-icon-4x.png';

import 'worker-loader?name=frontend-grocer-sw.js!./sw.js';

ReactDOM.render((<App />), document.getElementById('root'));

function askForNotificationPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
    .then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./frontend-grocer-sw.js')
    .then((registration) => {
      console.log('Service worker registered');
      askForNotificationPermission().then(() => {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            VAPID.publicKey
          )
        };

        return registration.pushManager.subscribe(subscribeOptions);
      }).then(function(pushSubscription) {
        return fetch('https://localhost:3100/api/push-subscription', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(pushSubscription)
        });
      });
      return true;
    })
    .catch((err) => {
      console.warn('Service worker registration failed', err);
      // Service worker registration failed
    });
} else {
  console.info('Service worker not supported');
  // Service worker is not supported
}