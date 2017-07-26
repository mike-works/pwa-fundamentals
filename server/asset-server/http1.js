/* eslint-env node */
const { spawn } = require('child_process');

const debug = require('debug')('http1.1');

function startH1(insecure) {

  debug('starting HTTP/1.1 server');
  let cmd = insecure ? 'watch:http' : 'watch';
  let h1Process = spawn('npm', ['run', cmd], {

  });
  h1Process.stdout.pipe(process.stdout);
  return h1Process;
}

module.exports = { startH1 };
