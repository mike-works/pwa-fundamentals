const chalk = require('chalk');
const webpackDevMiddleware = require('webpack-dev-middleware');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.config');

let app = express();

var fs = require('fs');
var net = require('net');
var http = require('http');
var https = require('https');

var baseAddress = 3000;
var redirectAddress = 3001;
var httpsAddress = 3443;
var httpsOptions = {
  key: fs.readFileSync('./private/key.pem'),
  cert: fs.readFileSync('./private/cert.pem')
};

net.createServer(tcpConnection).listen(baseAddress);
http.createServer(httpConnection).listen(redirectAddress);
https.createServer(httpsOptions, app).listen(httpsAddress);

function tcpConnection(conn) {
  conn.once('data', function (buf) {
    // A TLS handshake record starts with byte 22.
    var address = (buf[0] === 22) ? httpsAddress : redirectAddress;
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

const webpackMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: '/',
  stats: {
    colors: true
  },
});

app.use(webpackMiddleware);

process.stdout.write(chalk.yellow(' 💻  UI is served on https://localhost:3000\n'));