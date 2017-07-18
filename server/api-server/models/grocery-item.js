let _model = null;
module.exports = function (sequelize, DataTypes) {
  if (!_model) {
    _model = sequelize.define('grocery-item', {
      name: { type: DataTypes.STRING },
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
  return _model;
}