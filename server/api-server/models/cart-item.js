module.exports = function (sequelize, DataTypes) {
  const GroceryItem = require('./grocery-item')(sequelize, DataTypes);

  const CartItem = sequelize.define('cart-item', {
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: { min: 1, max: 999 }
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['groceryItemId']
    }]
    
  });
  CartItem.belongsTo(GroceryItem, { as: 'groceryItem'});
  return CartItem;
}