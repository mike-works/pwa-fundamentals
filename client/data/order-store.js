// @ts-check

import ListenerSupport from './listener-support';
import { endpoint as API_ENDPOINT } from '../utils/api';

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
    return fetch(`${API_ENDPOINT}/api/orders?status=pending`)
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._items = [...(jsonData.data || [])];
        this.onOrdersUpdated();
      });
  }

  getOrderById(id) {
    return fetch(`${API_ENDPOINT}/api/orders/${id}`)
      .then((resp) => resp.json())
      .then((jsonData) => jsonData.data);
  }

  onOrdersUpdated() {
    this.itemListeners.fire(this.items);
  }
}