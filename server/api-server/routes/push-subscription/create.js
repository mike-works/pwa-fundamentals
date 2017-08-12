module.exports = function (api) {
  const PushSubscription = api.db.models['push-subscription'];

  return function (req, res) {
    let { endpoint, keys } = req.body;
    PushSubscription.destroy({
      truncate: true
    }).then(() => {
      return PushSubscription.create({endpoint, keys: JSON.stringify(keys)}).then((ps) => {
        let record = ps.get({plain: true});
        record.keys = JSON.parse(record.keys);      
        res.json(record);
      }).catch((err) => {
        res.json({ error: `Problem saving data: ${err}` });
      });
    });
  }
}