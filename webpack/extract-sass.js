/* eslint-env node */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = new ExtractTextPlugin({
  filename: '[name]-[hash].css',
  disable: process.env.NODE_ENV === 'development'
});
