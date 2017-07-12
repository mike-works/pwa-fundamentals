import React from 'react';
import AppHeader from './index';
import renderer from 'react-test-renderer';
import {
  BrowserRouter as Router
} from 'react-router-dom';

test('AppHeader renders as expected', () => {
  const component = renderer.create(
    <Router>
      <AppHeader doToggle={() => {}}></AppHeader>
    </Router>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});