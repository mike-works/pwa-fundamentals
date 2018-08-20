/* eslint-env node */
module.exports = {
  verbose: true,
  testURL: 'http://localhost',
  roots: ['<rootDir>/client', '<rootDir>/server'],
  moduleNameMapper: {
    '.scss$': '<rootDir>/tools/SCSSStub.js'
  }
};
