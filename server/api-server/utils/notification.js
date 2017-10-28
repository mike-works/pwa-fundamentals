const chalk = require('chalk');
const path = require('path');
const webpush = require('web-push');
let VAPID;
if ( process.env.VAPID ) {
  VAPID = JSON.parse(process.env.VAPID);
} else {
  let pth = path.join(__dirname, '..', '..', '..', 'private', 'vapid');
  try {
    VAPID = require(pth);
  } catch(err) {
    process.stderr.write(chalk.bgRed.white('ERROR!: VAPID keys could not be loaded'));
    process.stderr.write(chalk.red(`  ↪ Expected to find keys in ${pth}.json\n    Make sure to run `) + chalk.yellow('npm run prepvapid') + chalk.red(' which should create this file for you'));
    process.exit(1);
  }
}

let PushSubscription = null;

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