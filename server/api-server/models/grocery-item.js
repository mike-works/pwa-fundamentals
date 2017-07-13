
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('grocery-item', {
    name: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    price: { type: DataTypes.STRING },
    unit: { type: DataTypes.STRING }
  });
}