/* eslint-env node */
const { startH2 } = require('./http2');
const { startH1 } = require('./http1');
const commander = require('commander');
const chalk = require('chalk');
const pkgJson = require('../package.json');

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
    chalk.white(` - Serving in ${mode} mode on ${protocol}://localhost:${port}. `) +
    chalk.yellow('Hit (Ctrl + C) to stop\n')
  );
}

class Server {
  constructor() {
    this.program = commander
      .version(pkgJson.version)
      .description('Frontend Grocer Build Tool')
      .option('-h2, --http2', 'Enable HTTP2 mode', Boolean.parse)
      .parse(process.argv);
  }
  start() {
    let { http2 } = this.program;
    printWelcome();

    if (http2) {
      startH2();
      printServerUp('HTTP/2', 5000, 'https');
      process.stdout.write(
        chalk.white.bgYellow(
          ' - NOTE: you\'ll have to stop this server and restart it to see changes\n'
        )
      );
    } else {
      startH1();
      printServerUp('HTTP/1.1');
    }
  }
}

module.exports = Server;
