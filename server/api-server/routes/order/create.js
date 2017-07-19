// @ts-check
let moment = require('moment');

function beginNotificationSequence(api, order) {
  let p = api.notifications
    .pushWithDelay(2000, {title: order.name, body: 'We\'ve started shopping'});
  let orderItems = order.getorderItems();
  process.stdout.write('\n\nzzzITEMS' + JSON.stringify(orderItems) + '\n\n');
  orderItems.forEach((orderItem) => {
    p = p.then(() => {
      return api.notifications.pushWithDelay(1000, {title: order.name, body: `In cart: ${orderItem.qty}x ${orderItem.groceryItem.name}`});
    });
  });
}

module.exports = function (api) {

  const OrderItem = api.db.models['order-item'];
  const Order = api.db.models['order'];
  const CartItem = api.db.models['cart-item'];
  const GroceryItem = api.db.models['grocery-item'];

  return function (req, res) {
    
    let items = req.body.data;
    api.db.transaction(() => {
      return GroceryItem.findAll({where: {
        id: {
          $in: items.map((i) => i.groceryItem.id)
        }
      }}).then((groceryItems) => {
        if (groceryItems.length === 0) {
          return Promise.reject('No items in order!');
        }
        return Order.create({
          name: 'TBD',
          totalPrice: 0
        }).then((order) => {
          let totalPrice = 0;
          return Promise.all(groceryItems.map((groceryItem) => {
            let qty = (items.filter((i) => i.groceryItem.id === groceryItem.id)[0]).qty;
            totalPrice += qty * groceryItem.price;
            return OrderItem.create({
              groceryItemId: groceryItem.id,
              orderId: order.id,
              qty
            });
          })).then(() => {
            let orderName = `Order placed at ${moment(order.createdAt).format('ddd, MMM D YY, h:mm a')}`;
            return order.update({
              name: orderName,
              totalPrice: 0.01 * Math.round(totalPrice * 100)
            });
          });
        });
      }).then((data) => { 
        return CartItem.destroy({
          truncate: true
        }).then(() => data);
      });
    }).then((o) => {
      beginNotificationSequence(api, o);
      return Order.find({where: {id: o.id}, include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: GroceryItem,
          as: 'groceryItem'
        }]
      }]});
    }).then((order) => {
      res.json({data: order.get({plain: true})});
    }).catch((err) => {
      res.json({ error: `Problem placing order: ${err}` });
    });
  }
}