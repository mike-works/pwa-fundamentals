const express = require('express');

const groceryItemsRoute = require('./routes/grocery-items');
const groceryCategoriesRoute = require('./routes/grocery-categories');

const getCartItemsRoute = require('./routes/cart/list-items');
const updateCartItemsRoute = require('./routes/cart/update-items');

const createOrderRoute = require('./routes/order/create');
const getOrdersRoute = require('./routes/order/list');
const getOrderRoute = require('./routes/order/show');
const indexRoute = require('./routes/index');

const createPushSubscriptionRoute = require('./routes/push-subscription/create');

module.exports = function (api) {
  let router = express.Router();
  router.get('/grocery/categories', groceryCategoriesRoute(api));
  router.get('/grocery/items', groceryItemsRoute(api));

  router.get('/cart/items', getCartItemsRoute(api));
  router.put('/cart/items', updateCartItemsRoute(api));

  router.get('/orders', getOrdersRoute(api));
  router.get('/orders/:id', getOrderRoute(api));
  router.post('/order', createOrderRoute(api));
  
  router.post('/push-subscription', createPushSubscriptionRoute(api));

  router.get('/', indexRoute());
  return router;
}

