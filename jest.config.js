/* eslint-env node */
module.exports = {
  verbose: true,
  roots: ['<rootDir>/client', '<rootDir>/server'],
  moduleNameMapper: {
    '.scss$': '<rootDir>/tools/SCSSStub.js'
  }
};
