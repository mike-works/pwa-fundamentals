import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import VAPID from './../private/vapid.json';

import 'file-loader?name=./img/launcher-icon-1x.png!./img/launcher-icon-1x.png';
import 'file-loader?name=./img/launcher-icon-2x.png!./img/launcher-icon-2x.png';
import 'file-loader?name=./img/launcher-icon-4x.png!./img/launcher-icon-4x.png';
import 'file-loader?name=./apple-touch-icon-57x57.png!./img/apple-touch-icon-57x57.png';
import 'file-loader?name=./apple-touch-icon-60x60.png!./img/apple-touch-icon-60x60.png';
import 'file-loader?name=./apple-touch-icon-72x72.png!./img/apple-touch-icon-72x72.png';
import 'file-loader?name=./apple-touch-icon-76x76.png!./img/apple-touch-icon-76x76.png';
import 'file-loader?name=./apple-touch-icon-114x114.png!./img/apple-touch-icon-114x114.png';
import 'file-loader?name=./apple-touch-icon-120x120.png!./img/apple-touch-icon-120x120.png';
import 'file-loader?name=./apple-touch-icon-144x144.png!./img/apple-touch-icon-144x144.png';
import 'file-loader?name=./apple-touch-icon-152x152.png!./img/apple-touch-icon-152x152.png';
import 'file-loader?name=./apple-touch-icon-180x180.png!./img/apple-touch-icon-180x180.png';

// Web Application Manifest
// https://developer.mozilla.org/en-US/docs/Web/Manifest
import 'file-loader?name=./web-app-manifest.json!./web-app-manifest.json';
import 'file-loader?name=./apple-touch-icon-180x180.png!./img/apple-touch-icon-180x180.png';

import 'worker-loader?name=./qr-worker.js!./qr-worker.js';
import 'worker-loader?name=./sw.js!./sw.js';

ReactDOM.render((<App />), document.getElementById('root'));

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let subscribeOptions = {
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(
    VAPID.publicKey
  )
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    return registration.pushManager.subscribe(subscribeOptions)
      .then((pushSubscription) => {
        return fetch('https://localhost:3100/api/push-subscription', {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(pushSubscription)
        })
      })
  });
}