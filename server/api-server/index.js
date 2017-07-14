const chalk = require('chalk');
const Db = require('./db');
const express = require('express');
var cors = require('cors');
const path = require('path');
const https = require('https');
const router = require('./router');
const getDevelopmentCertificate = require('devcert').default;

class ApiServer {
  constructor(prog) {
    this.program = prog;
    this.db = new Db();
  }

  _startApi() {
    this.app = express();

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