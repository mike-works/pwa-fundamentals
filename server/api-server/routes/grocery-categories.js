module.exports = function (api) {
  const GroceryItem = api.db.models['grocery-item'];

  let _cachedResults = null;

  return function (req, res) {
    if (_cachedResults) {
      res.json({ data: _cachedResults });
      return Promise.resolve(_cachedResults);
    }
    return GroceryItem.count({ attributes: ['category'], group: 'category' })
      .then((results) => {
        _cachedResults = results;
        res.json({ data: results });
        return _cachedResults;
      })
      .catch((err) => {
        res.json({ error: `Problem fetching data: ${err}` });
      });
  }
}