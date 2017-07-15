
const QUERY_DEFAULTS = Object.freeze({ limit: 10, offset: 0 });

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.substring(1)}`;
}

function toTitleCase(rawStr) {
  return rawStr
    .split(/[\s-]+/g)
    .map((s) => capitalize(s))
    .join(' ')
}

function prepareQuery(rawQuery) {
  let queryParams = Object.assign(Object.assign({}, QUERY_DEFAULTS), rawQuery);
  let { limit, offset, category } = queryParams;
  let safeQuery = { limit, offset };
  if (category) {
    safeQuery.where = {
      category: toTitleCase(category)
    };
  }
  return safeQuery;
}

module.exports = function (api) {
  const GroceryItem = api.db.models['grocery-item'];

  return function (req, res) {
    let queryOptions = prepareQuery(req.query || {});
    
    return GroceryItem.findAll(queryOptions)
      .then((results) => {
        let plainResults = results.map((x) => x.get({plain: true}))
        res.json({data: plainResults});
        return plainResults;
      })
      .catch((err) => {
        res.json({ error: `Problem fetching data: ${err}` });
      });
  }
}