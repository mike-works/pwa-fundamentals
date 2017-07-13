/* eslint-env node */

const extractSass = require('./extract-sass');

module.exports = function () {
  return {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }, {
          loader: 'eslint-loader',
          options: {
            emitError: true
          }
        }]
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules/muicss/lib/sass']
            }
          }]
        })
      }
    ]
  };
}