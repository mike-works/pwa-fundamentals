import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './sass/content-wrapper.scss';

import Home from './routes/home/';
import CategoryDetails from './routes/category-details/';
import OrderDetails from './routes/order-details/';

import SideDrawer from './components/side-drawer/';
import AppHeader from './components/app-header/';
import AppFooter from './components/app-footer/';
import Cart from './components/cart/';
import Orders from './components/orders/';

import Container from 'muicss/lib/react/container';

import CartStore from './data/cart-store';
import GroceryItemStore from './data/grocery-item-store';
import OrderStore from './data/order-store';

import { onQrCodeScan } from './utils/qrcode';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.cartStore = new CartStore();
    this.groceryItemStore = new GroceryItemStore();
    this.orderStore = new OrderStore();

    this.cartStore.itemListeners.register((newItems) => {
      this.setState({cartItems: newItems});
    });

    this.orderStore.orderListeners.register((newItems) => {
      this.setState({orders: newItems});
    });

    this.state = {
      drawerShowing: null,
      cartItems: this.cartStore.items,
      orders: this.orderStore.orders
    };
    this.toggleLeftDrawer = this.toggleLeftDrawer.bind(this);
    this.toggleRightDrawer = this.toggleRightDrawer.bind(this);
    this.closeAllDrawers = this.closeAllDrawers.bind(this);
    this.beginQrScan = this.beginQrScan.bind(this);

    this.homeRoute = (props) => (
      <Home
        cartStore={this.cartStore}
        groceryItemStore={this.groceryItemStore}
        {...props} />
    );
    this.categoryRoute = (props) => (
      <CategoryDetails
        cartStore={this.cartStore}
        groceryItemStore={this.groceryItemStore}
        {...props} />
    );
    this.orderRoute = (props) => (
      <OrderDetails
        orderStore={this.orderStore}
        {...props} />
    );
  }

  toggleLeftDrawer() {
    let oldState = this.state.drawerShowing;
    this.setState({ drawerShowing: oldState === 'left' ? null : 'left' });
  }

  toggleRightDrawer() {
    let oldState = this.state.drawerShowing;
    this.setState({ drawerShowing: oldState === 'right' ? null : 'right' });
  }

  closeAllDrawers() {
    this.setState({ drawerShowing: null });
  }

  beginQrScan(imageBuffer) {
    return onQrCodeScan(imageBuffer, this.cartStore);
  }

  render() {
    let wrapperClassNames = ['frontend-grocer'];
    if (this.state.drawerShowing === 'left') wrapperClassNames.push('show-left-sidedrawer');
    if (this.state.drawerShowing === 'right') wrapperClassNames.push('show-right-sidedrawer');
    return (
      <Router>
        <div className={wrapperClassNames.join(' ')}>
          <SideDrawer drawerShowing={this.state.drawerShowing === 'left'}>
            <div className="brand mui--appbar-line-height">
              <span className="mui--text-title">📦 Orders</span>
            </div>
            <div className="mui-divider"></div>
            <Orders orders={this.state.orders}/>
          </SideDrawer>
          <SideDrawer side={'right'} drawerShowing={this.state.drawerShowing === 'right'}>
            <div className="brand mui--appbar-line-height">
              <span className="mui--text-title">🛒 Cart</span>
            </div>
            <div className="mui-divider"></div>
            <Cart cartStore={this.cartStore} orderStore={this.orderStore} cartItems={this.state.cartItems} />
          </SideDrawer>
          <AppHeader
            numItemsInCart={this.state.cartItems.length}
            doQrScan={this.beginQrScan}
            doLeftToggle={this.toggleLeftDrawer} doRightToggle={this.toggleRightDrawer}></AppHeader>
          <div className="content-wrapper">
            <div className="mui--appbar-height"></div>
            <Container fluid={true}>
              <Route exact foo='bar' path="/" component={this.homeRoute} />
              <Route exact path="/category/:id" component={this.categoryRoute} />
              <Route exact path="/order/:id" component={this.orderRoute} />
            </Container>
          </div>
          <AppFooter></AppFooter>
          {this.state.drawerShowing
            ? <div id="mui-overlay" onClick={this.closeAllDrawers}></div>
            : ''}
        </div>
      </Router>
    );
  }
}

export default App;