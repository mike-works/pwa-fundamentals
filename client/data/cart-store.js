// @ts-check

import ListenerSupport from './listener-support';

export default class CartStore {
  constructor() {
    this._items = this._restoreCart();
    this.itemListeners = new ListenerSupport();
  }

  get items() {
    return Object.freeze([...this._items]);
  }

  _restoreCart() {
    fetch('https://localhost:3100/api/cart/items')
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._items = [...(jsonData.data || [])];
        this.onItemsUpdated();
      });
    return [];
  }

  _saveCart() {
    this.onItemsUpdated();
    fetch('https://localhost:3100/api/cart/items', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({data: this._items})
    });
  }

  addItemToCart(groceryItem) {
    let existingCartItem = this._items.filter((ci) => ci.groceryItem.id === groceryItem.id)[0];
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