// @ts-check

import React from 'react';

import './styles.scss';

const SideDrawer = ({ drawerShowing, children, side}) => {
  let topClasses = ['sidedrawer', 'mui--no-user-select', (side || 'left')];
  if (drawerShowing) {
    topClasses.push('active');
  }
  return (
    <div className={topClasses.join(' ')}>
      {children}
    </div>
  );
}
export default SideDrawer;