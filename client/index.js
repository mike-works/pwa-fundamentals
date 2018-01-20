/* global module: true */
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
import 'file-loader?name=./manifest.json!./manifest.json';
import 'worker-loader?name=./qrwork.js!./qrwork.js';
import 'worker-loader?name=./sw.js!./sw/sw.js';

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


if ('serviceWorker' in navigator) {
  // Okay, the browser supports service workers.
  navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    console.log(VAPID);
    let subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        VAPID.publicKey
      )
    };
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.subscribe(subscribeOptions).then(pushSubs => {
        fetch('https://localhost:3100/api/push-subscription', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pushSubs.toJSON())
        });
      });
    })
    // The service worker is registered.
  })
}

ReactDOM.render((<App />), document.getElementById('root'));

if (module.hot) {
  module.hot.accept(function () {
    console.log('Accepting the updated printMe module!');
  });
}