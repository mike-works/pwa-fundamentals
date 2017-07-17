import React from 'react';

import './styles.scss';

function formatPrice(rawPrice) {
  return `$${rawPrice.toFixed(2)}`;
}

const GroceryItem = ({ item, groceryActions }) => {
  let itemUrl = `https://localhost:3100${item.imageUrl}`;
  let price = formatPrice(item.price);
  let unit = item.unit;
  return (
    <li className='GroceryItem mui-panel'>
      <img className='item-image' src={itemUrl} alt={item.name}/>
      <h4 className='item-name'>{item.name}</h4>
      <span className="item-price bottom-tile bottom-tile--right">
        {price}
        {unit ? <span className='item-unit'>{unit}</span> : ''}
      </span>
      <button onClick={() => {
        groceryActions.addItemToCart(item)
      }} className="add-item-to-cart bottom-tile bottom-tile--left mui-btn mui-btn--accent" >+</button>
    </li>
  )
};

export default GroceryItem;