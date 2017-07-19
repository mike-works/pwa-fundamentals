import React, { Component } from 'react';

import './styles.scss';

class OrderDetails extends Component {
  constructor() {
    super(...arguments);
    this.state = { order: null };
  }
  _updateOrder(id) {
    let orderId = parseInt(id);
    this.props.orderStore.getOrderById(orderId).then((order) => {
      this.setState({
        order
      });
    });
  }
  componentDidMount() {
    this._updateOrder(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this._updateOrder(nextProps.match.params.id);
    }
    return false;
  }

  render() {
    let orderComponent = <div className='loading'>Loading...</div>;
    if (this.state.order) {
      let orderItems = this.state.order.orderItems.map((oi) => (
        <div key={oi.id} className='order-item mui-col-xs-6 mui-col-md-4 mui-col-lg-3'>
          <div className="mui-panel">
            <h3 className='item-name'>{oi.groceryItem.name}</h3>
            <img src={'https://localhost:3100' + oi.groceryItem.imageUrl} className='item-img' alt={oi.groceryItem.name} />

            <div className="bottom">
              <span className="item-qty">{oi.qty}</span> @
              <span className="item-price">${oi.groceryItem.price}</span>
              = <span className="item-price">${oi.qty * oi.groceryItem.price}</span>
            </div>
          </div>
        </div>
      ));
      orderComponent = (
        <div>
          <h1>{this.state.order.name}</h1>
          <div className='mui-divider'></div>
          <div className="order-items md-row">
            {orderItems}
          </div>
        </div>
      )
    }
    return (
      <div className='mui-container bg-white order-details'>
        {orderComponent}
      </div>
    );
  }
}

export default OrderDetails;