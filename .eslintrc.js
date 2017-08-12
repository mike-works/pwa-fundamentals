module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      "jsx": true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  plugins: ['babel', 'react', 'jest'],
  rules: {
    "quotes": [2, "single", "avoid-escape"],
    "indent": [2, 2],
    "no-console": 0,
    "strict": 0,
    "no-unused-vars": 0,
    "no-debugger": 0,
    'no-fallthrough': 0,
    "react/prop-types": 0
  }
};