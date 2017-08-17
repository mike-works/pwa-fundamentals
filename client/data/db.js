import idb from 'idb';
/* eslint-disable no-case-declarations */

export function getDb() {
  return idb.open('FEGrocerDB', 3, upgrade => {
    switch(upgrade.oldVersion) {
    case 0: // New database
      upgrade.createObjectStore('grocery-items', {keyPath: 'id'});
    case 1: // Upgrade from v1 to v2
      upgrade.createObjectStore('cart', { keyPath: 'groceryItem.id'})
    case 2: // Upgrade from v3 to v3
      let tx = upgrade.transaction;
      let giStore = tx.objectStore('grocery-items');
      giStore.createIndex('categoryIndex', 'category');
    }
  });
}
/* eslint-enable no-case-declarations */