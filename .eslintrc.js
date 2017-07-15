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
  plugins: ['babel', 'promise', 'react', 'jest'],
  rules: {
    "quotes": [2, "single", "avoid-escape"],
    "indent": [2, 2],
    "strict": 0,
    'no-fallthrough': 0,
    "react/prop-types": 0,
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/no-native": "off",
    "promise/no-promise-in-callback": "warn",
    "promise/no-callback-in-promise": "warn"
  }
};