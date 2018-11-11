/* eslint-env node */

module.exports = function(/*env*/) {
  return {
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    compress: true,
    debug: true,
    disableHostCheck: true,
    stats: {
      colors: true
    }
  };
};
