/* eslint-env node */
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractSass = require('./extract-sass');
const html = require('./html.config');


module.exports = function (env, options) {
  let plugins = [extractSass,
    new HtmlWebpackPlugin(html),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    })
    // ,new BundleAnalyzerPlugin()
  ];
  if (env === 'prod') {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    );
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap:
        options.devtool &&
        (options.devtool.indexOf('sourcemap') >= 0 ||
          options.devtool.indexOf('source-map') >= 0),
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
    );
    plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    );
    plugins.push(
      new CompressionPlugin({
        asset: '[path].gz',
        algorithm: 'gzip',
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8,
        compress: {
          warnings: false
        }
      })
    );
    plugins.push(new StyleExtHtmlWebpackPlugin());
  } else {
    plugins.push(
      new StyleLintPlugin({
        syntax: 'scss',
        quiet: false
      })
    );
  }
  plugins.push(
    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script',
      include: 'all',
      fileBlacklist: [/\.css/, /\.js.map/]
    })
  );
  return plugins;
};
