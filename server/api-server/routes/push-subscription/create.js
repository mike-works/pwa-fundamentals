const webpush = require('web-push');

const triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 410) {
        console.log('deleteSubscriptionFromDatabase ', err);
        // return deleteSubscriptionFromDatabase(subscription._id);
      } else {
        console.log('Subscription is no longer valid: ', err);
      }
    });
};

module.exports = function (api) {
  const PushSubscription = api.db.models['push-subscription'];

  return function (req, res) {
    let { endpoint, keys } = req.body;
    PushSubscription.create({endpoint, keys: JSON.stringify(keys)}).then((ps) => {
      let record = ps.get({plain: true});
      record.keys = JSON.parse(record.keys);
      setTimeout(() => {
        triggerPushMsg(record, JSON.stringify({
          notification: {
            title: 'My title',
            body: 'My body'
          }
        }));
      }, 2000)
      res.json(record);
    }).catch((err) => {
      res.json({ error: `Problem saving data: ${err}` });
    });
  }
}