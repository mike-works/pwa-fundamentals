let PushSubscription = null;
module.exports = function (sequelize, DataTypes) {
  if (!PushSubscription) {
    PushSubscription = sequelize.define('push-subscription', {
      endpoint: {
        type: DataTypes.STRING,
        allowNull: false
      },
      keys: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  }
  return PushSubscription;
}