import idb from 'idb';

export function getDb() {
  return idb.open('GrocerDB', 1, upgrade => {
    switch(upgrade.oldVersion) {
    case 0: // New database
      upgrade.createObjectStore('grocery-items', {keyPath: 'id'});
    }
  });
}