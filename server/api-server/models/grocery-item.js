
module.exports = function (sequelize, DataTypes) {
  const GroceryItem = sequelize.define('grocery-item', {
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  });

  // force: true will drop the table if it already exists
  GroceryItem.sync({ force: true }).then(() => {
    // Table created
    return GroceryItem.create({
      firstName: 'John',
      lastName: 'Hancock'
    });
  });
}