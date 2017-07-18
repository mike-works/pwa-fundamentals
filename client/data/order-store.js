// @ts-check

import ListenerSupport from './listener-support';

export default class OrderStore {
  constructor() {
    this._items = this._restoreOrders();
    this.itemListeners = new ListenerSupport();
  }

  get items() {
    return Object.freeze([...this._items]);
  }

  _restoreOrders() {
    fetch('https://localhost:3100/api/orders?status=pending')
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._items = [...(jsonData.data || [])];
        this.onOrdersUpdated();
      });
    return [];
  }

  onOrdersUpdated() {
    this.itemListeners.fire(this.items);
  }
}