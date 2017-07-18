let Order = null;
module.exports = function (sequelize, DataTypes) {
  if (!Order) {
    Order = sequelize.define('order', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      totalPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { min: 0, max: 1000000.00 }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
      }
    }, {
      indexes: [{
        fields: ['status']
      }]
    });
  }
  return Order;
}