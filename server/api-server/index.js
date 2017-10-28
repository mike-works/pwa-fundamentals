const chalk = require('chalk');
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const debug = require('debug')('api-server');
const router = require('./router');
const Db = require('./db');
const NotificationManager = require('./utils/notification');
const getDevelopmentCertificate = require('devcert-with-localhost').default;

function startAndListen(app, port) {
  return new Promise((resolve) => {
    app.listen(port, () => {
      resolve();
    });
  })
}

var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    callback(null, true);
  }
}

class ApiServer {
  constructor() {
    this.db = new Db();
    this.notifications = null;
  }

  _startApi() {
    this.app = express();
    this.app.disable('x-powered-by');
    this.app.use(bodyParser.json());
    this.app.use(cors(corsOptions));
    this.app.use('/api', router(this));
    this.app.use('/images', express.static(path.join(__dirname, '..', 'images')));
    this.app.use('/', express.static(path.join(__dirname, '..', '..', 'dist')));
    debug('Attempting to get certificate');
    return getDevelopmentCertificate('frontend-grocer', { installCertutil: true }).then((ssl) => {
      debug('SSL configuration received. Starting app server');
      return startAndListen(https.createServer(ssl, this.app), 3100);
    });
  }
  start() {
    return this.db.start()
      .then(() => {
        this.notifications = new NotificationManager(this);
      })
      .then(() => this._startApi())
      .then(() => {
        process.stdout.write(chalk.magenta('💻  API has started on https://localhost:3100/api'));
      });
  }
}

let api = new ApiServer();
api.start();