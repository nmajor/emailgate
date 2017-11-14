import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import Home from './container/Home';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
  </Route>
);

export default routes;
