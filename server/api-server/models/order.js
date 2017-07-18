let Order = null;
module.exports = function (sequelize, DataTypes) {
  if (!Order) {
    Order = sequelize.define('order', {
      totalPrice: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: { min: 0, max: 1000000.00 }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
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