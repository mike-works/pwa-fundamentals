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

class ApiServer {
  constructor(prog) {
    this.program = prog;
    this.db = new Db();
    this.notifications = null;
  }

  _startApi() {
    return new Promise((resolve) => {
      this.app = express();
      this.app.disable('x-powered-by');
      this.app.use(bodyParser.json());
      this.app.use(cors());
      this.app.use('/api', router(this));
      this.app.use('/images', express.static(path.join(__dirname, '..', 'images')));
      if (!process.env.ASSETS_PLAIN_HTTP) {
        debug('Attempting to get certificate');
        return getDevelopmentCertificate('frontend-grocer', { installCertutil: true }).then((ssl) => {
          debug('SSL configuration received. Starting app server');
          https.createServer(ssl, this.app).listen(this.program.apiPort, () => {
            debug(`App server started on https://localhost:${this.program.apiPort}`);
            process.stdout.write(chalk.white(` - Starting API on https://localhost:${this.program.apiPort}\n\n`));
            resolve();
          });
        });
      } else {
        this.app.listen(this.program.apiPort, () => {
          debug(`App server started on https://localhost:${this.program.apiPort}`);
          process.stdout.write(chalk.white(` - Starting API on https://localhost:${this.program.apiPort}\n\n`));
          resolve();
        });
      }
    })
  }
  async start() {
    await this.db.start();
    this.notifications = new NotificationManager(this);
    await this._startApi();
    debug('api has started');
  }
}

module.exports = ApiServer;