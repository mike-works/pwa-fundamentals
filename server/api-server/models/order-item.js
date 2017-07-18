let OrderItem = null;
module.exports = function (sequelize, DataTypes) {
  if (!OrderItem) {
    const GroceryItem = require('./grocery-item')(sequelize, DataTypes);
    const Order = require('./order')(sequelize, DataTypes);

    OrderItem = sequelize.define('order-item', {
      qty: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 999 }
      },
      retrieved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      indexes: [{
        fields: ['orderId']
      }, {
        unique: true,
        fields: ['orderId', 'groceryItemId']
      }]
    });
    OrderItem.belongsTo(GroceryItem, {as: 'groceryItem', allowNull: false });
    OrderItem.belongsTo(Order, {as: 'order', allowNull: false });
    Order.hasMany(OrderItem, {as: 'orderItems'});
    return OrderItem;
  }
  return OrderItem;
}