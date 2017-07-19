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

let PushSubscription = null;

const vapidKeys = {
  publicKey:
'BEjhXRecX4bqqTs9dsQqJOK9Vu6WWbXbKNucWUQWKdWQeibinW2EEf5FozbAotXxq2kEafSr3BUxmotklIrbY5o',
  privateKey: 'SdU7EuFWIRoCr66Igzt0LFhN7RiP65jAZOJOloxh17s'
};

webpush.setVapidDetails(
  'mailto:mike@mike.works',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
  
class NotificationManager {
  constructor(api) {
    this.api = api;
    PushSubscription = this.api.db.models['push-subscription'];
  }
  push({title, body}) {
    return PushSubscription.findAll()
      .then((subscriptions) => {
        subscriptions.forEach((subs) => {
          let record = subs.get({plain: true});
          record.keys = JSON.parse(record.keys);

          return webpush.sendNotification(record, JSON.stringify({
            notification: {
              title,
              body          
            }
          }))
            .catch((err) => {
              if (err.statusCode === 410) {
                console.log('deleteSubscriptionFromDatabase ', subs.id);
                subs.destroy();
              } else {
                console.log('Subscription is no longer valid: ', err);
              }
            });
        });
      })
      .then(() => this);
  }
  pushWithDelay(delay, info) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let pushPromise = this.push(info);
        resolve(pushPromise);
      }, delay);
    });
  }
}

module.exports = NotificationManager