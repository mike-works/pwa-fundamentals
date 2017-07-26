import React from 'react';
import { Link } from 'react-router-dom';

import './styles.scss';

const Orders = ({ orders }) => {
  let orderItems = orders.map((o) => {
    return (
      <li key={o.id} className='orders-list-item sidedrawer-list__item'>
        <Link to={`/order/${o.id}`}>
          <p>{o.name}</p>
          <p>
            <span className="mui--pull-right">
              <span className="badge">
                {o.status}
              </span>
            </span>
            <b className='price'>${o.totalPrice} </b>
          </p>
        </Link>
      </li>
    );
  })
  return (
    <ul className='sidedrawer-list orders-list'>
      {orderItems.length > 0
        ? orderItems
        : <li className='sidedrawer-list__item'>No Orders</li>}
    </ul>
  );
}

export default Orders;