import React from 'react';

// import './styles.scss';

const Orders = ({ orders }) => {
  let orderItems = orders.map((o) => {
    let d = new Date(o.createdAt);
    let dateString = `${d.toLocaleString()}`;
    return (
      <li key={o.id} className='sidedrawer-list__item'>
        <p>Order placed at {dateString}</p>
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