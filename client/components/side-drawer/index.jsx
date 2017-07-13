import React from 'react';

import './styles.scss';

const SideDrawer = ({ drawerShowing }) => (
  <div id="sidedrawer" className={drawerShowing ? 'mui--no-user-select active' : 'mui--no-user-select'}>
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
  </div>
);

export default SideDrawer;