import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './app';
// import VAPID from './../private/vapid.json';

import 'file-loader?name=./img/launcher-icon-1x.png!./img/launcher-icon-1x.png';
import 'file-loader?name=./img/launcher-icon-2x.png!./img/launcher-icon-2x.png';
import 'file-loader?name=./img/launcher-icon-4x.png!./img/launcher-icon-4x.png';

ReactDOM.render((<App />), document.getElementById('root'));
