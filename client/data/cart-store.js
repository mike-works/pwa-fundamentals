// @ts-check

import ListenerSupport from './listener-support';

const TEMP_DATA = [
  {
    'id': 132,
    'groceryItem': {
      'id': 132,
      'name': '365 Organic Whole Wheat Bread',
      'category': 'Bakery',
      'imageUrl': '/images/425.jpg',
      'price': 3.49,
      'unit': 'Lb',
      'createdAt': '2017-07-14T09:47:01.756Z',
      'updatedAt': '2017-07-14T09:47:01.756Z'
    },
    'qty': 2
  }, {
    'id': 140,
    'groceryItem': {
      'id': 140,
      'name': 'Whole Foods Market Cupcakes, Two-Bite, Vanilla',
      'category': 'Bakery',
      'imageUrl': '/images/454.jpg',
      'price': 4.99,
      'unit': 'Each',
      'createdAt': '2017-07-14T09:47:01.831Z',
      'updatedAt': '2017-07-14T09:47:01.831Z'
    },
    'qty': 2
  }, {
    'id': 120,
    'groceryItem': {
      'id': 120,
      'name': '365 Whole Wheat Bread',
      'category': 'Bakery',
      'imageUrl': '/images/424.jpg',
      'price': 2.99,
      'unit': '',
      'createdAt': '2017-07-14T09:47:01.707Z',
      'updatedAt': '2017-07-14T09:47:01.707Z'
    },
    'qty': 1
  }, {
    'id': 104,
    'groceryItem': {
      'id': 104,
      'name': '365 Organic Sour Cream',
      'category': 'Dairy',
      'imageUrl': '/images/403.jpg',
      'price': 2.99,
      'unit': '',
      'createdAt': '2017-07-14T09:47:01.570Z',
      'updatedAt': '2017-07-14T09:47:01.570Z'
    },
    'qty': 1
  }, {
    'id': 130,
    'groceryItem': {
      'id': 130,
      'name': '365 Organic White Quinoa',
      'category': 'Frozen',
      'imageUrl': '/images/484.jpg',
      'price': 4.99,
      'unit': '',
      'createdAt': '2017-07-14T09:47:01.741Z',
      'updatedAt': '2017-07-14T09:47:01.741Z'
    },
    'qty': 2
  }
];

export default class CartStore {
  constructor() {
    this._items = this._restoreCart();
    this.itemListeners = new ListenerSupport();
  }

  get items() {
    return Object.freeze(this._items);
  }

  _restoreCart() {
    return TEMP_DATA;
  }

  _saveCart() {
    this.onItemsUpdated();
  }

  addItemToCart(groceryItem) {
    let existingCartItem = this.items.filter((ci) => ci.id === groceryItem.id)[0];
    if (existingCartItem) {
      existingCartItem.qty++;
    } else {
      let newItem = {
        id: groceryItem.id,
        groceryItem,
        qty: 1
      };
      this._items = this.items.concat(newItem);
    }
    this._saveCart();
  }

  removeItemFromCart(groceryItem) {
    let existingCartItem = this.items.filter((ci) => ci.id === groceryItem.id)[0];
    if (existingCartItem.qty > 1) {
      existingCartItem.qty--;
    } else {
      let idx = this.items.findIndex((i) => i.id === groceryItem.id);
      this._items.splice(idx, 1);
    }
    this._saveCart();
  }

  onItemsUpdated() {
    this.itemListeners.fire(this.items);
  }
}