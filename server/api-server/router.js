const express = require('express');

const groceryItemsRoute = require('./routes/grocery-items');
const groceryCategoriesRoute = require('./routes/grocery-categories');

const getCartItemsRoute = require('./routes/cart/get-items');
const updateCartItemsRoute = require('./routes/cart/update-items');


module.exports = function (api) {
  let router = express.Router();
  router.get('/grocery/categories', groceryCategoriesRoute(api));
  router.get('/grocery/items', groceryItemsRoute(api));
  router.get('/cart/items', getCartItemsRoute(api));
  router.put('/cart/items', updateCartItemsRoute(api));
  return router;
}

