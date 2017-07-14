const commander = require('commander');
const pkgJson = require('../../package.json');

let program = commander
  .version(pkgJson.version)
  .description('Frontend Grocer Build Tool');

program.command('serve', 'Start the development web server');

program.command('gen-certs', 'Generate SSL certificates');

program.parse(process.argv);