// @ts-check

import ListenerSupport from './listener-support';
import { endpoint as API_ENDPOINT } from '../utils/api';
import idb from 'idb';

function cartItemDb() {
  return idb.open('cartItemDb', 1, upgradeDb => {
    switch (upgradeDb.oldVersion) {
    case 0:
      // initially set the DB up
      upgradeDb.createObjectStore('cart-items', {keyPath: 'groceryItem.id'});
    }
  })
}

/**
 * A class for keeing track of shopping cart state
 * @public
 */
export default class CartStore {
  /**
   * Instantiate a new CartStore
   * There's usually only one of these per app
   * 
   * @public
   * @return {CartStore}
   */
  constructor() {
    this._items = []; // Items currently in the cart
    /**
     * Create a ListenerSupport instance, that we can register listeners to
     * and fire events from. This one is how we'll let other parts of this app
     * "observe" changes to the contents of the shopping cart
     */
    this.itemListeners = new ListenerSupport();
    /**
     * The _restoreCart() function is responsible for getting the "initial"
     * cart state. This may seem a little strange for now, but it's a "blank"
     * we'll fill in later as we add in offline support 
     */
    this._restoreCart().then((newItems) => {
      // once the promise returned by _restoreCart resolves
      this._items = newItems; // use the value as the contents of the cart
      this._onItemsUpdated();  // notify anyone who may care about cart contents changing
    });
  }

  /**
   * Get the array of items currently in the shopping cart.
   * This is a read-only array
   * 
   * @public
   * @return {ReadonlyArray<Object>}
   */
  get items() {
    return Object.freeze([...this._items]);
  }

  /**
   * Get the "initial" contents of the cart.
   * For now the cart will start as an empty array, but we'll enhance this later!
   * 
   * @private
   * @return {Promise<Array<Object>>}
   */
  _restoreCart() {
    let dbPromise = cartItemDb();
    return dbPromise.then(db => {
      let tx = db.transaction('cart-items', 'readonly');
      let idbStore = tx.objectStore('cart-items');
      return idbStore.getAll();
    }).then((items) => {
      if (navigator.onLine)
        fetch(`${API_ENDPOINT}api/cart/items`)
          .then((response) => {
            if (response.ok) return response.json();
            else throw new Error('Problem fetching cart data');
          })
          .then(jsonData => jsonData.data)
          .then(cartItems => {
            return dbPromise.then(db => {
              let txx = db.transaction('cart-items', 'readwrite');
              let iidbStore = txx.objectStore('cart-items');
              return Promise.all(
                cartItems.map(ci => iidbStore.put(ci))
              ).then(() => cartItems);
            }).then((cartItems) => {
              this._items = cartItems;
              this._onItemsUpdated();
            });
          });
      return items;
    });
  }

  /**
   * Persist the contents of the cart
   * For now this will only cause the UI to update, but we'll enhance it later
   * 
   * @private
   * @return {Promise} the new cart
   */
  _saveCart() {
    this._onItemsUpdated();
    return cartItemDb().then(db => {
      let tx = db.transaction('cart-items', 'readwrite');
      let idbStore = tx.objectStore('cart-items');
      return Promise.all(
        this._items.map(ci => idbStore.put(ci))
      ).then(() => {
        if (navigator.onLine) {
          return db.transaction('cart-items').objectStore('cart-items').getAll().then(dbItems => {
            return fetch(`${API_ENDPOINT}api/cart/items`, {
              method: 'PUT',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({ data: dbItems})
            }).then((response) => response.json())
              .then((jsonData) => jsonData.data);
          });
        }
      });
    });
  }

  /**
   * "Check out" of the grocery store, turning the contents of the shopping cart
   * into an "order"
   * 
   * @public
   * @return {Promise} 
   */
  doCheckout() {
    return fetch(`${API_ENDPOINT}api/order`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ data: this._items })
    }).then((response) => response.json())
      .then((jsonData) => jsonData.data)
      .then(this._restoreCart)
      .then((newItems) => {
        this._items = newItems;
        this._onItemsUpdated();
      });
  }

  /**
   * 
   * @param {Object} groceryItem 
   */
  addItemToCart(groceryItem) {
    // check to see if this grocery item is already in the cart
    let existingCartItem = this._items
      .filter((ci) => `${ci.groceryItem.id}` === `${groceryItem.id}`)[0];

    if (existingCartItem) {
      // if it's already in the cart, increment its quantity
      existingCartItem.qty++;
    } else {
      // if it's not yet in the cart, add it to the cart
      let newItem = {
        groceryItem,
        qty: 1
      };
      this._items = this._items.concat(newItem);
    }
    // persist the cart (i.e., to an API)
    this._saveCart();
  }

  /**
   * Remove a grocery item from the cart.
   * Depending on the quantity of this item in the cart, the quantity may be decremented
   * or the item may be removed entirely.
   * @param {Object} groceryItem 
   */
  removeItemFromCart(groceryItem) {
    // find an existing object in the cart corresponding to this grocery item
    let existingCartItem = this._items
      .filter((ci) => ci.groceryItem.id === groceryItem.id)[0];

    if (!existingCartItem) return; // nothing was in the cart to begin with

    // if the existing item found has a quantity > 1
    if (existingCartItem.qty > 1) {
      // decrement the quantity
      existingCartItem.qty--;
    } else {
      // otherwise (i.e., quantity is 1) remove the object from the cart entirely
      // find its index
      let idx = this._items.findIndex((i) => i.groceryItem.id === groceryItem.id);
      // remove the object in the cart at that index
      this._items.splice(idx, 1);
    }
    // persist the cart
    this._saveCart();
  }

  /**
   * Notify any registered listeners that the cart items have changed
   * 
   * @private
   * @return {void}
   */
  _onItemsUpdated() {
    this.itemListeners.fire(this.items);
  }
}