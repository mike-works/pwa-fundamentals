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

function startAndListen(app, port, protocol = 'https') {
  return new Promise((resolve) => {
    app.listen(port, () => {
      debug(`App server started on ${protocol}://localhost:${port}`);
      process.stdout.write(chalk.white(` - Starting API on ${protocol}://localhost:${port}\n\n`));
      resolve();
    });
  })
}

// var whitelist = ['https://localhost:3000', 'https://localhost:5000']
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    callback(null, true);
  }
}

class ApiServer {
  constructor(prog) {
    this.program = prog;
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
    if (!this.program.insecure) {
      debug('Attempting to get certificate');
      return getDevelopmentCertificate('frontend-grocer', { installCertutil: true }).then((ssl) => {
        debug('SSL configuration received. Starting app server');
        return startAndListen(https.createServer(ssl, this.app), this.program.apiPort);
      });
    } else {
      return startAndListen(this.app, this.program.apiPort, 'http');
    }
  }
  async start() {
    await this.db.start();
    this.notifications = new NotificationManager(this);
    await this._startApi();
    debug('api has started');
  }
}

module.exports = ApiServer;