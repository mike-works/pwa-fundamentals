import React from 'react';

import './styles.scss';

const CartItem = ({cartItem, groceryActions}) => {
  let itemImgUrl = `https://localhost:3100${cartItem.groceryItem.imageUrl}`;
  let totalPrice = cartItem.qty * cartItem.groceryItem.price;
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }
  return (
    <tr className='sidedrawer-list__item cart-item'>
      <td className='cart-item__qty'>
        <button onClick={() => {
          groceryActions.addItemToCart(cartItem.groceryItem)
        }} className="qty-up">▲</button>
        <div className="amt">{cartItem.qty}</div>
        <button onClick={() => {
          groceryActions.removeItemFromCart(cartItem.groceryItem)
        }} className="qty-up">▼</button>
      </td>
      <td className='cart-item__img'>
        <img src={itemImgUrl} alt={cartItem.groceryItem.name}/>
      </td>
      <td className='cart-item__description'>
        <div className='cart-item__name'>{cartItem.groceryItem.name}</div>
        <div className='cart-item__unit'>{formatPrice(cartItem.groceryItem.price)} / {cartItem.groceryItem.unit || 'each'}</div>
      </td>

      <td className='cart-item__price'>
        {formatPrice(totalPrice)}
      </td>
    </tr>
  );
}

export default CartItem;