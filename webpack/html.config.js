/* eslint-env node */
module.exports = {
  title: 'Frontend Grocers',
  template: 'client/index.ejs',
  apiEndpoint: process.env.API_ENDPOINT || 'https://localhost:3100'
};