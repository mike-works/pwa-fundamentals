/* eslint-env node */
const path = require('path');
const execFile = require('child_process').execFile;
const simplehttp2server = require('simplehttp2server');
var tmp = require('tmp');

const debug = require('debug')('http2');
const fs = require('fs');

const DEFAULT_HTTP2_SERVER_CONFIG = {
  headers: [
    {
      source: '/',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache'
        },
        {
          key: 'link',
          value: '</JS>; rel=prelad; as=script, </CSS>; rel=preload; as=style'
        }
      ]
    }
  ]
};

// const CSS_REGEX = /<link href="\/(app-[0-9a-f]+.css)" rel="stylesheet">/g
const JS_REGEX = /<script type="text\/javascript" src="\/(app-[0-9a-f]+.js)">/g

function generateConfig(configPath) {
  debug('generating server configuration');
  let html = fs.readFileSync(path.join(__dirname, '..', '..', 'dist', 'index.html')).toString();
  // let [, cssFilename] = CSS_REGEX.exec(html);
  let jsFilename = JS_REGEX.exec(html)[1];

  let cfg = Object.assign({}, DEFAULT_HTTP2_SERVER_CONFIG);
  cfg.headers[0].headers[1].value = cfg.headers[0].headers[1].value
    .replace('JS', jsFilename);
  // .replace('CSS', cssFilename);
  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_HTTP2_SERVER_CONFIG, null, ' '), 'UTF8');
}

function startH2() {
  

  debug('starting HTTP/2 server');
  tmp.file(function _tempFileCreated(err, configPath, fd, cleanupCallback) {
    generateConfig(configPath);
    let srv = execFile(
      simplehttp2server,
      ['-config', configPath],
      {
        cwd: path.join(__dirname, '..', '..', 'dist')
      },
      (err, out) => {
        let stream = err ? process.stderr : process.stdout;
        stream.write('HTTP/2 Server has stopped', err, out);
      }
    );
    srv.stdout.pipe(process.stdout);
    setTimeout(() => {
      cleanupCallback();
    }, 1000);
    return srv;    
  });
}

module.exports = { startH2 };
