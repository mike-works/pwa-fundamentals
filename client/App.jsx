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

import Container from 'muicss/lib/react/container';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerShowing: null };
    this.toggleLeftDrawer = this.toggleLeftDrawer.bind(this);
    this.toggleRightDrawer = this.toggleRightDrawer.bind(this);
    this.closeAllDrawers = this.closeAllDrawers.bind(this);
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
              <li>
                <strong>Category 1</strong>
                <ul>
                  <li><a href="#">Item 1</a></li>
                  <li><a href="#">Item 2</a></li>
                  <li><a href="#">Item 3</a></li>
                </ul>
              </li>
              <li>
                <strong>Category 2</strong>
                <ul>
                  <li><a href="#">Item 1</a></li>
                  <li><a href="#">Item 2</a></li>
                  <li><a href="#">Item 3</a></li>
                </ul>
              </li>
              <li>
                <strong>Category 3</strong>
                <ul>
                  <li><a href="#">Item 1</a></li>
                  <li><a href="#">Item 2</a></li>
                  <li><a href="#">Item 3</a></li>
                </ul>
              </li>
            </ul>
          </SideDrawer>
          <SideDrawer side={'right'} drawerShowing={this.state.drawerShowing === 'right'}>
            <div className="brand mui--appbar-line-height">
              <span className="mui--text-title">Cart</span>
            </div>
            <div className="mui-divider"></div>
          </SideDrawer>
          <AppHeader doLeftToggle={this.toggleLeftDrawer} doRightToggle={this.toggleRightDrawer}></AppHeader>
          <div className="content-wrapper">
            <div className="mui--appbar-height"></div>
            <Container fluid={true}>
              <Route exact path="/" component={Home}/>
              <Route exact path="/category/:id" component={CategoryDetails}/>
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