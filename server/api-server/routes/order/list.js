// @ts-check

module.exports = function (api) {
  const Order = api.db.models['order'];
  const OrderItem = api.db.models['order-item'];
  const GroceryItem = api.db.models['grocery-item'];

  return function (req, res) {
    let queryOptions = {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: GroceryItem,
          as: 'groceryItem'
        }]
      }]
    };


    let status = (req.query || {}).status;
    switch ((status || '').toLowerCase()) {
    case 'all': break;
    case undefined:
    case '':
      queryOptions.where = {
        status: 'pending'
      };
      break;
    case 'pending':
    case 'inprogress':
    case 'complete':
      queryOptions.where = {
        status
      };
      break;
    default:
      throw `Invalid status filter: ${status}`;
    }

    
    return Order.findAll(queryOptions).then((results) => {
      let plainResults = results.map((x) => x.get({plain: true}))
      res.json({data: plainResults});
      return plainResults;
    }).catch((err) => {
      res.json({ error: `Problem fetching data: ${err}` });
    });
  }
}