const commander = require('commander');
const pkgJson = require('../../package.json');
const chalk = require('chalk');

function addOption(cmd, flag, valName, description, defaultVal) {
  return cmd.option(
    `--${flag} [${valName}]`,
    description + ' ' + chalk.yellow(`(default: ${defaultVal})`),
    defaultVal)
}

function processArgs(argslist) {

  let program = commander
    .version(pkgJson.version)
    .description('Frontend Grocer Build Tool');

  program = addOption(program, 'h2', 'bool', 'Enable HTTP2 mode for web client', false);
  program = addOption(program, 'api-port', 'port', 'Set for REST API', '3100');

  program = program.parse(argslist);
  return program;
}

module.exports = processArgs;