// @ts-check

import ListenerSupport from './listener-support';

export default class GroceryItemStore {
  constructor() {
    this._items = this._restoreItems();
    this.categoryListeners = new ListenerSupport();
    this.itemListeners = new ListenerSupport();
    this._categories = this._restoreCategories();
  }

  get categories() {
    return Object.freeze(this._categories);
  }

  get items() {
    return Object.freeze(this._items);
  }

  itemsForCategory(categoryName, limit) {
    return this.items
      .filter((item) => item.category.toLowerCase() === categoryName.toLowerCase())
      .slice(0, limit)
  }

  _updateItems(data) {
    let itemHash = {};
    this._items.forEach((i) => {
      itemHash[i.id] = i;
    });
    data.forEach((dataItem) => itemHash[dataItem.id] = dataItem);
    this._items = Object.keys(itemHash).map((k) => itemHash[k]);
  }

  updateItemsForCategory(categoryName, limit = 10) {
    fetch(`https://localhost:3100/api/grocery-items?category=${categoryName}&limit=${limit}`)
      .then((resp) => resp.json())
      .then((jsonData) => {
        this._updateItems(jsonData.data);
        this.onItemsUpdated();
      })
      .catch((err) => {
        console.error('Error fetching grocery items', err);
      });
  }

  updateCategories() {
    fetch('https://localhost:3100/api/grocery-categories')
      .then((resp) => resp.json())
      .then((jsonData) => {
        let categories = jsonData.data.map((item) => item.category);
        this._categories = categories;
        this.onCategoriesUpdated();
      })
      .catch((err) => {
        console.error('Error updating categories', err);
      });
  }

  _restoreItems() {
    return [];
  }

  _restoreCategories() {
    return [];
  }

  onItemsUpdated() {
    this.itemListeners.fire(this.items);
  }
  onCategoriesUpdated() {
    this.categoryListeners.fire(this.categories);
  }
}
