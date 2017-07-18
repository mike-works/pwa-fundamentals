
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('grocery-item', {
    groceryItem: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    price: { type: DataTypes.DOUBLE },
    unit: { type: DataTypes.STRING }
  }, {
    indexes: [{
      fields: ['category']
    }]
  });
}