import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import DashboardContainer from './container/DashboardContainer';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={DashboardContainer} />
  </Route>
);

export default routes;
