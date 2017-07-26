const { startH2 } = require('./http2');
const { startH1 } = require('./http1');
const chalk = require('chalk');
const pkgJson = require('../../package.json');

function printWelcome() {
  let txt = chalk.white(`FRONTEND GROCER v${pkgJson.version}`);
  process.stdout.write('\n' +
    chalk.bgBlue.black(' ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ \n') +
    chalk.bgBlue.black(` ┃   ${txt}   ┃ \n`) +
    chalk.bgBlue.black(' ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ \n') + '\n'
  );
}
function printServerUp(mode, port = 3000, protocol = 'http') {
  process.stdout.write(
    chalk.white(` - Serving web client in ${mode} mode on ${protocol}://localhost:${port}. `) +
    chalk.yellow('Hit (Ctrl + C) to stop\n')
  );
}

class AssetServer {
  constructor(prog) {
    this.program = prog;
  }
  start() {
    let { http2 } = this.program;
    printWelcome();

    if (http2) {
      startH2();
      printServerUp('HTTP/2', 5000, 'https');
      process.stdout.write(
        chalk.black.bgYellow(
          ' - NOTE: you\'ll have to stop this server and restart it to see changes\n'
        )
      );
    } else {
      startH1(process.env.ASSETS_PLAIN_HTTP || false);
      printServerUp('HTTP/1.1', 3000, 'https');
    }
  }
}

module.exports = AssetServer;