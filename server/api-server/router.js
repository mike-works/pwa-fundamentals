const express = require('express');

const itemsRoute = require('./routes/grocery-items');
const categoriesRoute = require('./routes/grocery-categories');

module.exports = function (api) {
  let router = express.Router();
  router.get('/grocery-categories', categoriesRoute(api));
  router.get('/grocery-items', itemsRoute(api));
  return router;
}

