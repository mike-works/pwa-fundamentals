const express = require('express');

const itemsRoute = require('./routes/items');
const categoriesRoute = require('./routes/categories');

module.exports = function (api) {
  let router = express.Router();
  router.get('/categories', categoriesRoute(api));
  router.get('/items', itemsRoute(api));
  return router;
}

