import React from 'react';
import SideDrawer from './index';
import renderer from 'react-test-renderer';

test('SideDrawer renders as expected when drawer is showing', () => {

  const component = renderer.create(
    <SideDrawer drawerShowing={true}></SideDrawer>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('SideDrawer renders as expected when drawer is hiding', () => {

  const component = renderer.create(
    <SideDrawer drawerShowing={false}></SideDrawer>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});