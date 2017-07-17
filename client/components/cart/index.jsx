import React from 'react';
import CartItem from './cart-item';

import './styles.scss';

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

const Cart = ({cartItems = [], groceryActions}) => {
  if (cartItems.length === 0) {
    return (
      <ul className='sidedrawer-list'>
        <li className='sidedrawer-list__item'>
          Nothing in cart
        </li>
      </ul>
    );
  }
  let items = cartItems.map((item) => <CartItem groceryActions={groceryActions} key={item.id} cartItem={item} />);
  let grandTotal = cartItems.reduce((tot, item) => {
    return tot + (item.groceryItem.price * item.qty);
  }, 0);
  let checkoutButton = (
    <button className='checkout-btn mui-btn mui-btn--accent'>
      Checkout <span className="amt">{formatPrice(grandTotal)}</span>
    </button>
  );
  return (
    <div className='cart'>
      {cartItems.length > 0 ? checkoutButton : ''}
      <table className='cart-items'>
        <tbody>
          {items}
        </tbody>
      </table>
      <div className="mui-divider"></div>
    </div>
  );
};

export default Cart;