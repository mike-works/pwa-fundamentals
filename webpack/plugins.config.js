/* eslint-env node */
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const extractSass = require('./extract-sass');
const html = require('./html.config');

module.exports = function(env, options) {
  let plugins = [
    // extractSass,
    new HtmlWebpackPlugin(html),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    })
  ];
  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  if (env === 'prod') {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    );
    plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    );
    plugins.push(
      new CompressionPlugin({
        filename: '[path].gz',
        algorithm: 'gzip',
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  } else {
    plugins.push(new webpack.NamedModulesPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  // plugins.push(new StyleExtHtmlWebpackPlugin());
  return plugins;
};
