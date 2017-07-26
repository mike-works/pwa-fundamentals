// @ts-check

import ListenerSupport from './listener-support';
import { endpoint as API_ENDPOINT } from '../utils/api';

/**
 * A class for keeping track of grocery item state
 * @public
 */
export default class GroceryItemStore {
  /**
   * Create a new instance
   * There's usually only one of these per app
   * @public
   * @return {GroceryItemStore}
   */
  constructor() {
    // restore items to get their initial state
    this._items = [];
    this._restoreItems().then((restoredItems) => {
      this._items = restoredItems;
      this._onItemsUpdated();
    });

    // restore categories to get their initial state
    this._categories = [];
    this._restoreCategories().then((restoredCategories) => {
      this._categories = restoredCategories;
      this._onCategoriesUpdated();
    });

    // Set up listener support for grocery items and categories (one for each)
    this.categoryListeners = new ListenerSupport();
    this.itemListeners = new ListenerSupport();
  }

  /**
   * Get the list of categories
   * This is a read only array
   * 
   * @public
   * @return {ReadonlyArray<String>}
   */
  get categories() {
    return Object.freeze(this._categories);
  }

  /**
   * Get the list of grocery items
   * This is a read only array
   * 
   * @public
   * @return {ReadonlyArray<Object>}
   */
  get items() {
    return Object.freeze(this._items);
  }

  /**
   * Get a filtered list of items for a particular category
   * This does not result in a new request being sent out, it only
   * filters results already available locally
   * 
   * @public
   * @param {String} categoryName name of category to filter by
   * @param {Number} limit maximum number of items to return
   * @return {Promise<Array<Object>>} filtered list of items
   */
  itemsForCategory(categoryName, limit) {
    return Promise.resolve(
      this.items
        .filter((item) => item.category.toLowerCase() === categoryName.toLowerCase())
        .slice(0, limit)
    );
  }

  /**
   * Given an array of grocery items, add new ones we haven't seen yet to the _items array
   * and update existing ones to reflect any changes in properties
   *  
   * @private
   * @param {Array<Object>} data array of grocery items to push into the store
   * @return {void}
   */
  _updateItems(data) {
    let itemHash = {};
    this._items.forEach((i) => {
      itemHash[i.id] = i;
    });
    data.forEach((dataItem) => itemHash[dataItem.id] = dataItem);
    this._items = Object.keys(itemHash).map((k) => itemHash[k]);
  }

  /**
   * Retrieve fresh data for grocery items pertaining to a particular category
   * They will get pushed into the store, and any appropriate listeners will fire
   * as a result of this process.
   * 
   * @public
   * @param {String} categoryName name of category to filter by
   * @param {Number} limit maximum number of items to return
   * @return {Promise<ReadonlyArray<Object>>}
   */
  updateItemsForCategory(categoryName, limit = 10) {
    return fetch(`${API_ENDPOINT}api/grocery/items?category=${categoryName}&limit=${limit}`)
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._updateItems(jsonData.data);
        this._onItemsUpdated();
        return this.items;
      })
      .catch((err) => {
        console.error('Error fetching grocery items', err);
        return this.items;
      });
  }

  /**
   * Retrieve fresh data for grocery categories.
   * They will get pushed into the store, and any appropriate listeners will
   * fire as a result of this process.
   * 
   * @public
   * @return {Promise<ReadonlyArray<String>>}
   */
  updateCategories() {
    return fetch(`${API_ENDPOINT}api/grocery/categories`)
      .then((resp) => resp.json())
      .then((jsonData) => {
        let categories = jsonData.data.map((item) => item.category);
        this._categories = categories;
        this._onCategoriesUpdated();
        return this.categories;
      })
      .catch((err) => {
        console.error('Error updating categories', err);
        return this.categories;
      });
  }
  
  /**
   * Get the "initial" state for grocery items
   * For we'll start with an empty array, but we'll enhance this later!
   * 
   * @private
   * @return {Promise}
   */
  _restoreItems() {
    return Promise.resolve([]);
  }

  /**
   * Get the "initial" state for grocery categories
   * For we'll start with an empty array, but we'll enhance this later!
   * 
   * @private
   * @return {Promise}
   */
  _restoreCategories() {
    return Promise.resolve([]);
  }
  
  /**
   * Notify any registered listeners that grocery items have changed
   * 
   * @private
   * @return {void}
   */
  _onItemsUpdated() {
    this.itemListeners.fire(this.items);
  }

  /**
   * Notify any registered listeners that grocery categories have changed
   * 
   * @private
   * @return {void}
   */
  _onCategoriesUpdated() {
    this.categoryListeners.fire(this.categories);
  }
}
