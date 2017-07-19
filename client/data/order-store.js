// @ts-check

import ListenerSupport from './listener-support';

export default class OrderStore {
  constructor() {
    this._items = [];
    this.refresh();
    this.itemListeners = new ListenerSupport();
  }

  get items() {
    return Object.freeze([...this._items]);
  }

  refresh() {
    return fetch('https://localhost:3100/api/orders?status=pending')
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._items = [...(jsonData.data || [])];
        this.onOrdersUpdated();
      });
  }

  getOrderById(id) {
    return fetch(`https://localhost:3100/api/orders/${id}`)
      .then((resp) => resp.json())
      .then((jsonData) => jsonData.data);
  }

  onOrdersUpdated() {
    this.itemListeners.fire(this.items);
  }
}