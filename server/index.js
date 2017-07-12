/* eslint-env node */
const AssetServer = require('./asset-server');
const ApiServer = require('./api-server');
const argsProcessor = require('./cli/args');

class Server {
  constructor() {
    this.program = argsProcessor(process.argv);
    this.assetServer = new AssetServer(this.program);
    this.apiServer = new ApiServer(this.program);
  }
  start() {
    this.assetServer.start();
    this.apiServer.start();
  }
}

module.exports = Server;
