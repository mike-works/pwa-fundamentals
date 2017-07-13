const commander = require('commander');
const pkgJson = require('../../package.json');
const chalk = require('chalk');


let program = commander
  .version(pkgJson.version)
  .description('Frontend Grocer Build Tool');

program.command('serve', 'Start the development web server');

program.command('gen-certs', 'Generate SSL certificates');

// function addOption(cmd, flag, valName, description, defaultVal) {
//   return cmd.option(
//     `--${flag} [${valName}]`,
//     description + ' ' + chalk.yellow(`(default: ${defaultVal})`),
//     defaultVal)
// }

// function processArgs(argslist) {


//     .command('serve', 'Start the server');
//   // addOption(program, 'http2', 'bool', 'Enable HTTP2 mode for web client', false);
//   // addOption(program, 'api-port', 'port', 'Set for REST API', '3100');

//   program.parse(argslist);
//   return program;
// }

program.parse(process.argv);
// module.exports = processArgs;