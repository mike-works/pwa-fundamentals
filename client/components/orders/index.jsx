import React from 'react';

// import './styles.scss';

const Orders = ({ orders }) => {
  let orderItems = orders.map((o) => {
    return (
      <li key={o.id} className='sidedrawer-list__item'>
        <p>{o.name}</p>
        <b className='mui--pull-left'>
          <span className="badge">
            {o.status}
          </span>
        </b>
        <b className='mui--pull-right'>${o.totalPrice}</b>
      </li>
    );
  })
  return (
    <ul className='sidedrawer-list c'>
      {orderItems.length > 0
        ? orderItems
        : <li className='sidedrawer-list__item'>No Orders</li>}
    </ul>
  );
}

export default Orders;