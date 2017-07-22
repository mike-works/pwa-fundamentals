/* eslint-env node */

module.exports = function (/*env*/) {
  return {
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    noInfo: true,
    compress: true,
    disableHostCheck: true,
    stats: {
      colors: true
    }
  };
}