/* eslint-env node */

module.exports = function (/*env*/) {
  return {
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    noInfo: true,
    stats: {
      colors: true
    }
  };
}