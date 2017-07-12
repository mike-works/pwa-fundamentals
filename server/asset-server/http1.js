/* eslint-env node */
const { spawn } = require('child_process');

const debug = require('debug')('http1.1');

function startH1() {

  debug('starting HTTP/1.1 server');

  let h1Process = spawn('npm', ['run', 'watch'], {

  });
  h1Process.stdout.pipe(process.stdout);
  return h1Process;
}

module.exports = { startH1 };
