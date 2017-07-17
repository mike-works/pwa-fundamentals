import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './sass/content-wrapper.scss';

import Home from './routes/home/';
import CategoryDetails from './routes/category-details/';

import SideDrawer from './components/side-drawer/';
import AppHeader from './components/app-header/';
import AppFooter from './components/app-footer/';
import Cart from './components/cart/';

import Container from 'muicss/lib/react/container';

// const TEMP_DATA = [
//   {
//     'id': 132,
//     'groceryItem': {
//       'id': 132,
//       'name': '365 Organic Whole Wheat Bread',
//       'category': 'Bakery',
//       'imageUrl': '/images/425.jpg',
//       'price': 3.49,
//       'unit': 'Lb',
//       'createdAt': '2017-07-14T09:47:01.756Z',
//       'updatedAt': '2017-07-14T09:47:01.756Z'
//     },
//     'qty': 2
//   }, {
//     'id': 140,
//     'groceryItem': {
//       'id': 140,
//       'name': 'Whole Foods Market Cupcakes, Two-Bite, Vanilla',
//       'category': 'Bakery',
//       'imageUrl': '/images/454.jpg',
//       'price': 4.99,
//       'unit': 'Each',
//       'createdAt': '2017-07-14T09:47:01.831Z',
//       'updatedAt': '2017-07-14T09:47:01.831Z'
//     },
//     'qty': 2
//   }, {
//     'id': 120,
//     'groceryItem': {
//       'id': 120,
//       'name': '365 Whole Wheat Bread',
//       'category': 'Bakery',
//       'imageUrl': '/images/424.jpg',
//       'price': 2.99,
//       'unit': '',
//       'createdAt': '2017-07-14T09:47:01.707Z',
//       'updatedAt': '2017-07-14T09:47:01.707Z'
//     },
//     'qty': 1
//   }, {
//     'id': 104,
//     'groceryItem': {
//       'id': 104,
//       'name': '365 Organic Sour Cream',
//       'category': 'Dairy',
//       'imageUrl': '/images/403.jpg',
//       'price': 2.99,
//       'unit': '',
//       'createdAt': '2017-07-14T09:47:01.570Z',
//       'updatedAt': '2017-07-14T09:47:01.570Z'
//     },
//     'qty': 1
//   }, {
//     'id': 130,
//     'groceryItem': {
//       'id': 130,
//       'name': '365 Organic White Quinoa',
//       'category': 'Frozen',
//       'imageUrl': '/images/484.jpg',
//       'price': 4.99,
//       'unit': '',
//       'createdAt': '2017-07-14T09:47:01.741Z',
//       'updatedAt': '2017-07-14T09:47:01.741Z'
//     },
//     'qty': 2
//   }
// ];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerShowing: 'right', cartItems: [] };
    this.toggleLeftDrawer = this.toggleLeftDrawer.bind(this);
    this.toggleRightDrawer = this.toggleRightDrawer.bind(this);
    this.closeAllDrawers = this.closeAllDrawers.bind(this);

    this.groceryActions = {

      addItemToCart: (groceryItem) => {
        let existingCartItem = this.state.cartItems.filter((ci) => ci.id === groceryItem.id)[0];
        if (existingCartItem) {
          existingCartItem.qty++;
          this.setState({ cartItems: this.state.cartItems });
        } else {
          let newItem = {
            id: groceryItem.id,
            groceryItem,
            qty: 1
          };
          this.setState({ cartItems: this.state.cartItems.concat(newItem) });
        }
      },
      removeItemFromCart: (groceryItem) => {
        let existingCartItem = this.state.cartItems.filter((ci) => ci.id === groceryItem.id)[0];
        if (existingCartItem.qty > 1) {
          existingCartItem.qty--;
          this.setState({ cartItems: this.state.cartItems });
        } else {
          let idx = this.state.cartItems.findIndex((i) => i.id === groceryItem.id);
          this.state.cartItems.splice(idx, 1);
          this.setState({cartItems: this.state.cartItems});
        }
      }
    }

    this.homeRoute = (props) => <Home groceryActions={this.groceryActions} {...props} />;
    this.categoryRoute = (props) => <CategoryDetails groceryActions={this.groceryActions} {...props} />;    
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

  render() {
    let wrapperClassNames = ['frontend-grocer'];
    if (this.state.drawerShowing === 'left') wrapperClassNames.push('show-left-sidedrawer');
    if (this.state.drawerShowing === 'right') wrapperClassNames.push('show-right-sidedrawer');
    return (
      <Router>
        <div className={wrapperClassNames.join(' ')}>
          <SideDrawer drawerShowing={this.state.drawerShowing === 'left'}>
            <div className="brand mui--appbar-line-height">
              <span className="mui--text-title">Frontend Grocer</span>
            </div>
            <div className="mui-divider"></div>
            <ul>

            </ul>
          </SideDrawer>
          <SideDrawer side={'right'} drawerShowing={this.state.drawerShowing === 'right'}>
            <Cart groceryActions={this.groceryActions} cartItems={this.state.cartItems} />
          </SideDrawer>
          <AppHeader
            numItemsInCart={this.state.cartItems.length}
            doLeftToggle={this.toggleLeftDrawer} doRightToggle={this.toggleRightDrawer}></AppHeader>
          <div className="content-wrapper">
            <div className="mui--appbar-height"></div>
            <Container fluid={true}>
              <Route exact foo='bar' path="/" component={this.homeRoute} />
              <Route exact path="/category/:id" component={this.categoryRoute} />
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