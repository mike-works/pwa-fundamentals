// @ts-check

import ListenerSupport from './listener-support';
import { endpoint as API_ENDPOINT } from '../utils/api';

/**
 * A class for keeping track of order state
 * @public
 */
export default class OrderStore {
  /**
   * Create a new OrderStore instance.
   * There's usually only one of these per app
   * @public
   * @return {OrderStore}
   */
  constructor() {
    this._items = [];
    this.refresh();
    this.orderListeners = new ListenerSupport();
  }

  /**
   * Get the list of orders in the store
   * This is a read-only array
   * 
   * @public
   * @return {ReadonlyArray<Object>}
   */
  get orders() {
    return Object.freeze(this._items);
  }

  /**
   * Fetch fresh data, and refresh the list of orders in memory.
   * This will result in any appropriate listeners being notified
   * 
   * @public
   * @return {Promise<ReadonlyArray<Object>>}
   */
  refresh() {
    return fetch(`${API_ENDPOINT}api/orders?status=pending`)
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._items = [...(jsonData.data || [])];
        this._onOrdersUpdated();
        return this.orders;
      });
  }

  /**
   * Get an individual order by id
   * This will result a new API request being made
   * 
   * @public
   * @param {Number|String} id 
   * @return {Promise<Object>} the order
   */
  getOrderById(id) {
    return fetch(`${API_ENDPOINT}api/orders/${id}`)
      .then((resp) => resp.json())
      .then((jsonData) => jsonData.data);
  }

  /**
   * Notify any appropriate observers that the orders have changed
   * 
   * @private
   * @return {void}
   */
  _onOrdersUpdated() {
    this.orderListeners.fire(this.orders);
  }
}