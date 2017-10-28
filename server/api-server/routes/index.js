module.exports = function () {
  return function (req, res) {
    res.json({
      routes: {
        get: {
          '/grocery/categories': 'Grocery category list',
          '/grocery/items': 'Grocery item list',
          '/cart/items': 'Cart items list',
          '/orders': 'Orders list',
          '/orders/:id': 'Order details',
          '/': 'This page'
        },
        put: {
          '/cart/items': 'Update cart contents'
        },
        post: {
          '/order': 'Create an order (check out)',
          '/push-subscription': 'Create WebPush subscription'
        }
      }
    });
  }
}