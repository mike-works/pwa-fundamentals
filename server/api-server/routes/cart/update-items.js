// @ts-check


module.exports = function (api) {
  // const GroceryItem = api.db.models['grocery-item'];
  const CartItem = api.db.models['cart-item'];
  const GroceryItem = api.db.models['grocery-item'];

  function divideCartWork(items, allPlainCartItems) {
    let toAdd = null;
    let toUpdate = null;
    let toRemove = null;

    let groceryIdsInDbCart = allPlainCartItems.map((x) => x.groceryItemId);
    let itemIds = items.map((i) => i.groceryItem.id);
    toAdd = items.filter((d) => groceryIdsInDbCart.indexOf(d.groceryItem.id) < 0);
    toUpdate = items.filter((d) => groceryIdsInDbCart.indexOf(d.groceryItem.id) >= 0);
    toRemove = groceryIdsInDbCart.filter((id) => itemIds.indexOf(id) < 0);

    return { toAdd, toUpdate, toRemove };
  }

  function addCartItems(items) {
    return Promise.all(items.map((item) => {
      return CartItem.findOrCreate({ where: { groceryItemId: item.groceryItem.id } }).then(([cartItem]) => {
        return cartItem.update({
          qty: item.qty
        });
      });
    }));
  }

  return function (req, res) {
    // let queryOptions = prepareQuery(req.query || {});
    let items = req.body.data;
    api.db.transaction(() => {
      return CartItem.findAll().then((allCartItems) => {
        let allPlainCartItems = allCartItems.map((ci) => ci.get({ plain: true }));
        let { toAdd, toUpdate, toRemove } = divideCartWork(items, allPlainCartItems);
        return addCartItems(toAdd.concat(toUpdate)).then(() => {
          if (toRemove.length > 0) {
            return CartItem.destroy({
              where: {
                groceryItemId: {
                  $in: toRemove
                }
              }
            });
          } else {
            return Promise.resolve();
          }
        });
        // console.log('add', toAdd);
        // console.log('update', toUpdate);
        // console.log('remove', toRemove);

      })
    }).then(() => {
      return CartItem.findAll({ include: [{model: GroceryItem, as: 'groceryItem'}] })
        .then((results) => {
          let plainResults = results.map((x) => x.get({plain: true}))
          res.json({data: plainResults});
          return plainResults;
        })
        .catch((err) => {
          res.json({ error: `Problem fetching data: ${err}` });
        });
    });
    // return CartItem.findAll({})
    //   .then((results) => {
    //     let plainResults = results.map((x) => x.get({plain: true}))
    //     res.json({data: plainResults});
    //     return plainResults;
    //   })
    //   .catch((err) => {
    //     res.json({ error: `Problem fetching data: ${err}` });
    //   });
  }
}