const webpush = require('web-push');
const VAPID = process.env.VAPID ? JSON.parse(process.env.VAPID) : require('../../../private/vapid');

let PushSubscription = null;

// console.log('VAPID', VAPID)
webpush.setVapidDetails(
  'mailto:mike@mike.works',
  VAPID.publicKey,
  VAPID.privateKey
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