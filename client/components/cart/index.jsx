import React, { Component } from 'react';
import CartItem from './cart-item';

import './styles.scss';

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = { checkoutConfirmVisible: false };
  }
  confirmCheckout() {
    this.setState({checkoutConfirmVisible: true});
  }
  cancelConfirmCheckout() {
    this.setState({checkoutConfirmVisible: false});
  }
  render() {
    let cartStore = this.props.cartStore;
    let cartItems = cartStore.items;

    if (cartItems.length === 0) {
      return (
        <ul className='sidedrawer-list'>
          <li className='sidedrawer-list__item'>
          Nothing in cart
          </li>
        </ul>
      );
    }
    let items = cartItems.map((item) => (
      <CartItem cartStore={cartStore} key={item.groceryItem.id} cartItem={item} />
    ));

    let grandTotal = cartItems.reduce((tot, item) => {
      return tot + (item.groceryItem.price * item.qty);
    }, 0);

    let checkoutConfirmClassName = `checkout-confirm ${this.state.checkoutConfirmVisible ? 'open' : ''}`;

    let checkoutButton = (
      <div className='checkout-btn-container'>
        <button className='checkout-btn mui-btn mui-btn--accent'
          onClick={() => {
            this.confirmCheckout();
          }}>
          Checkout <span className="amt">{formatPrice(grandTotal)}</span>
        </button>
        <div className={checkoutConfirmClassName}>
          <h4 className="mui--text-center">Are you sure?</h4>
          <button onClick={() => {
            cartStore.doCheckout().then(() => {
              this.props.orderStore.refresh();
            })
          } } className='mui-btn mui-btn--primary confirm-btn'>Yes</button>
          <button onClick={() => this.cancelConfirmCheckout()} className='mui-btn mui-btn--secondary cancel-btn'>No</button>
        </div>
        <div className="mui-divider"></div>
      </div>
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
  }
}

export default Cart;