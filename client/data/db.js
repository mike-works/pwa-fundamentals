import idb from 'idb';

export function getDb() {
  return idb.open('GrocerDB', 2, upgrade => {
    switch(upgrade.oldVersion) {
    case 0: // New database
      upgrade.createObjectStore('grocery-items', {keyPath: 'id'});
    case 1: // Upgrade from v1 to v2
      upgrade.createObjectStore('cart', { keyPath: 'groceryItem.id'})
    }
  });
}