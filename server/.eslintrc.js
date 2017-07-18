module.exports = {
  root: false,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended'
  ],
  env: {
    node: true,
    es6: true
  },
  plugins: ['babel'],
  rules: {
    "quotes": [2, "single", "avoid-escape"],
    "indent": [2, 2],
    "strict": 0,
    "no-console": 0,
    'no-fallthrough': 0
  }
};