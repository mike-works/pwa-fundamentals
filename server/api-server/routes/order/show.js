// @ts-check

module.exports = function (api) {
  const Order = api.db.models['order'];
  const OrderItem = api.db.models['order-item'];
  const GroceryItem = api.db.models['grocery-item'];

  return function (req, res) {
    let queryOptions = {
      where: {
        id: req.params.id
      },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: GroceryItem,
          as: 'groceryItem'
        }]
      }]
    };
    
    return Order.findOne(queryOptions).then((result) => {
      let plainResult = result.get({plain: true})
      res.json({data: plainResult});
      return plainResult;
    }).catch((err) => {
      res.json({ error: `Problem fetching data: ${err}` });
    });
  }
}