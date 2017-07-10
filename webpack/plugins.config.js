/* eslint-env node */
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");

const extractSass = require('./extract-sass');
const html = require('./html.config');

module.exports = function (env, options) {
  let plugins = [
    extractSass,
    new HtmlWebpackPlugin(html)
  ];
  if (env === 'prod') {
    plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0),
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }));
    plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }));
    plugins.push(new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		}));
  }
  return plugins;
}