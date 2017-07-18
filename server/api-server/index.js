const chalk = require('chalk');
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const router = require('./router');
const Db = require('./db');

const getDevelopmentCertificate = require('devcert-with-localhost').default;

const vapidKeys = {
  publicKey:
'BEjhXRecX4bqqTs9dsQqJOK9Vu6WWbXbKNucWUQWKdWQeibinW2EEf5FozbAotXxq2kEafSr3BUxmotklIrbY5o',
  privateKey: 'SdU7EuFWIRoCr66Igzt0LFhN7RiP65jAZOJOloxh17s'
};

webpush.setVapidDetails(
  'mailto:mike@mike.works',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

class ApiServer {
  constructor(prog) {
    this.program = prog;
    this.db = new Db();
  }

  _startApi() {
    this.app = express();
    this.app.disable('x-powered-by');
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use('/api', router(this));
    this.app.use('/images', express.static(path.join(__dirname, '..', 'images')));

    return getDevelopmentCertificate('frontend-grocer', { installCertutil: true }).then((ssl) => {
      https.createServer(ssl, this.app).listen(this.program.apiPort, () => {
        chalk.white(` - Starting API on https://localhost:${this.program.apiPort}\n\n`)
      });
    });
  }
  async start() {
    await this.db.start();
    this._startApi();
  }
}

module.exports = ApiServer;