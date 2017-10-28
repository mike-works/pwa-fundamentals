const fs = require('fs');
const net = require('net');
const http = require('http');
const https = require('https');
const path = require('path');

const chalk = require('chalk');
const webpackDevMiddleware = require('webpack-dev-middleware');
const express = require('express');
const webpack = require('webpack');

const webpackConfig = require('../../webpack.config');

const HTTP_BASE_ADDRESS = 3000;
const HTTP_REDIRECT_ADDRESS = 3001;
const HTTPS_ADDRESS = 3443;

const TLS_KEY_PATH = path.join(__dirname, '..', '..', 'private', 'key.pem');
const TLS_CERT_PATH = path.join(__dirname, '..', '..', 'private', 'cert.pem');

let app = express();

if (!fs.existsSync(TLS_KEY_PATH)) {
  process.stderr.write(
    chalk.bgRed.white('X.509 private key was not found.') +
    chalk.red(`\n  ↪ Expected to find it at ${TLS_KEY_PATH}`) +
    chalk.red('\n    Make sure to run ') +
      chalk.yellow('npm run prepcerts') +
      chalk.red(' which should create this file for you')
  );
  process.exit(1);
}
if (!fs.existsSync(TLS_CERT_PATH)) {
  process.stderr.write(
    chalk.bgRed.white('X.509 certificate was not found.') +
    chalk.red(`\n  ↪ Expected to find it at ${TLS_CERT_PATH}`) +
    chalk.red('\n    Make sure to run ') +
      chalk.yellow('npm run prepcerts') +
      chalk.red(' which should create this file for you')
  );
  process.exit(1);
}

let httpsOptions = {
  key: fs.readFileSync(TLS_KEY_PATH),
  cert: fs.readFileSync(TLS_CERT_PATH)
};

net.createServer(tcpConnection).listen(HTTP_BASE_ADDRESS);
http.createServer(httpConnection).listen(HTTP_REDIRECT_ADDRESS);
https.createServer(httpsOptions, app).listen(HTTPS_ADDRESS);

function tcpConnection(conn) {
  conn.once('data', function (buf) {
    // A TLS handshake record starts with byte 22.
    var address = (buf[0] === 22) ? HTTPS_ADDRESS : HTTP_REDIRECT_ADDRESS;
    var proxy = net.createConnection(address, function () {
      proxy.write(buf);
      conn.pipe(proxy).pipe(conn);
    });
  });
}

function httpConnection(req, res) {
  var host = req.headers['host'];
  res.writeHead(301, { 'Location': 'https://' + host + req.url });
  res.end();
}

const compiler = webpack(webpackConfig());
const hotMiddleware = require('webpack-hot-middleware')(compiler);
const webpackMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: '/',
  hot: true,
  stats: {
    colors: true
  },
});

app.use(webpackMiddleware);
app.get('*', function(req, res, next) {
  let accept = req.headers.accept || '';
  if (accept.indexOf('text/html') < 0) {
    next();
    return;
  }
  let pth = path.join(__dirname, '..', '..', 'dist', 'index.html');
  res.write(webpackMiddleware.fileSystem.readFileSync(pth));
  res.end();
});
app.use(hotMiddleware);

process.stdout.write(chalk.yellow(' 💻  UI is served on https://localhost:3000\n'));