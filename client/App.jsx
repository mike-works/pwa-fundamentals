import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './sass/content-wrapper.scss';

import Home from './routes/home/';

import SideDrawer from './components/side-drawer/';
import AppHeader from './components/app-header/';
import AppFooter from './components/app-footer/';

import Container from 'muicss/lib/react/container';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerShowing: false };
    this.toggleSideDrawer = this.toggleSideDrawer.bind(this);
  }
  toggleSideDrawer() {
    this.setState({ drawerShowing: !this.state.drawerShowing });
  }

  render() {
    return (
      <Router>
        <div className={this.state.drawerShowing ? 'frontend-grocer' : 'frontend-grocer hide-sidedrawer'}>
          <SideDrawer drawerShowing={this.state.drawerShowing}></SideDrawer>
          <AppHeader doToggle={this.toggleSideDrawer}></AppHeader>
          <div className="content-wrapper">
            <div className="mui--appbar-height"></div>
            <Container fluid={true}>
              <Route exact path="/" component={Home}/>
            </Container>
          </div>
          <AppFooter></AppFooter>
          {this.state.drawerShowing
            ? <div id="mui-overlay" onClick={this.toggleSideDrawer}></div>
            : ''}
        </div>
      </Router>
    );
  }
}

export default App;