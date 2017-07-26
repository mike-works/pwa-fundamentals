const commander = require('commander');
const pkgJson = require('../../package.json');
const chalk = require('chalk');

const AssetServer = require('../asset-server');
const ApiServer = require('../api-server');

function addOption(cmd, flag, valName, description, defaultVal) {
  return cmd.option(
    `--${flag} [${valName}]`,
    description + ' ' + chalk.yellow(`(default: ${defaultVal})`),
    defaultVal)
}

let program = commander
  .version(pkgJson.version)
  .name('./run serve')
  .description('Frontend Grocer Build Tool: Web Server');

addOption(program, 'http2', 'bool', 'Enable HTTP2 mode for web client', false);
addOption(program, 'insecure', 'bool', 'Disable HTTPS', false);
addOption(program, 'api-port', 'port', 'Set for REST API', '3100');

program.parse(process.argv);

class Server {
  constructor() {
    this.assetServer = new AssetServer(program);
    this.apiServer = new ApiServer(program);
  }
  start() {
    this.assetServer.start();
    this.apiServer.start();
  }
}

module.exports = Server;
(new Server).start();