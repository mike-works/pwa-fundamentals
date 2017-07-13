/* eslint-env node */
const path = require('path');
const execFile = require('child_process').execFile;
const simplehttp2server = require('simplehttp2server');

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
          value: '</JS>; rel=preload; as=script, </CSS>; rel=preload; as=style'
        }
      ]
    }
  ]
};
const H2_CONFIG_PATH = path.join(__dirname, '..', '..', 'tmp', 'h2.config.json');
// const CSS_REGEX = /<link href="(app-[0-9a-f]+.css)" rel="stylesheet">/g
const JS_REGEX = /<script type="text\/javascript" src="(app-[0-9a-f]+.js)">/g

function generateConfig() {
  debug('generating server configuration');
  let html = fs.readFileSync(path.join(__dirname, '..', '..', 'dist', 'index.html')).toString();
  // let [, cssFilename] = CSS_REGEX.exec(html);
  let [, jsFilename] = JS_REGEX.exec(html);

  let cfg = Object.assign({}, DEFAULT_HTTP2_SERVER_CONFIG);
  cfg.headers[0].headers[1].value = cfg.headers[0].headers[1].value
    .replace('JS', jsFilename);
  // .replace('CSS', cssFilename);
  fs.writeFileSync(H2_CONFIG_PATH, JSON.stringify(DEFAULT_HTTP2_SERVER_CONFIG, null, ' '), 'UTF8');
}

function startH2() {
  generateConfig();

  debug('starting HTTP/2 server');

  let srv = execFile(
    simplehttp2server,
    ['-config', H2_CONFIG_PATH],
    {
      cwd: path.join(__dirname, '..', '..', 'dist')
    },
    (err, out) => {
      let stream = err ? process.stderr : process.stdout;
      console.error('HTTP/2 Server has stopped', err, out);
    }
  );
  srv.stdout.pipe(process.stdout);
  return srv;
}

module.exports = { startH2 };
