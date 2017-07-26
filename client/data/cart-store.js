// @ts-check

import ListenerSupport from './listener-support';
import { endpoint as API_ENDPOINT } from '../utils/api';

export default class CartStore {
  constructor() {
    this._items = [];
    this._restoreCart().then((newItems) => {
      this._items = newItems;
      this.onItemsUpdated();
    });
    this.itemListeners = new ListenerSupport();
  }

  get items() {
    return Object.freeze([...this._items]);
  }

  _restoreCart() {
    return fetch(`${API_ENDPOINT}/api/cart/items`)
      .then((resp) => resp.json())
      .then((jsonData) =>  [...(jsonData.data || [])]);
  }

  _saveCart() {
    this.onItemsUpdated();
    fetch(`${API_ENDPOINT}/api/cart/items`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({data: this._items})
    });
  }

  doCheckout() {
    return fetch(`${API_ENDPOINT}/api/order`, {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({data: this._items})
    }).then(this._restoreCart)
      .then((newItems) => {
        this._items = newItems;
        this.onItemsUpdated();
      });
  }

  addItemToCart(groceryItem) {
    let existingCartItem = this._items
      .filter((ci) => `${ci.groceryItem.id}` === `${groceryItem.id}`)[0];
    if (existingCartItem) {
      existingCartItem.qty++;
    } else {
      let newItem = {
        groceryItem,
        qty: 1
      };
      this._items = this._items.concat(newItem);
    }
    this._saveCart();
  }

  removeItemFromCart(groceryItem) {
    let existingCartItem = this._items.filter((ci) => ci.groceryItem.id === groceryItem.id)[0];
    if (existingCartItem.qty > 1) {
      existingCartItem.qty--;
    } else {
      let idx = this._items.findIndex((i) => i.groceryItem.id === groceryItem.id);
      this._items.splice(idx, 1);
    }
    this._saveCart();
  }

  onItemsUpdated() {
    this.itemListeners.fire(this.items);
  }
}