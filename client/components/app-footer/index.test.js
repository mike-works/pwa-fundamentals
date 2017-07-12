import React from 'react';
import AppFooter from './index';
import renderer from 'react-test-renderer';

test('AppFooter renders as expected', () => {
  const component = renderer.create(
    <AppFooter></AppFooter>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});