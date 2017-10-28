/* eslint-env node */
const path = require('path');

const moduleConfig = require('./webpack/module.config');
const plugins = require('./webpack/plugins.config');
const devServer = require('./webpack/devserver.config');

module.exports = function () {
  return {
    entry: {
      app: [
        'webpack-hot-middleware/client',
        './client/index.js'
      ]
    },
    stats: {
      colors: true
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: devServer(...arguments),
    devtool: 'cheap-module-source-map',
    output: {
      filename: '[name]-[hash].js',
      publicPath: '/',
      path: path.resolve(__dirname, 'dist')
    },
    module: moduleConfig(...arguments),
    plugins: plugins(...arguments)
  };
};