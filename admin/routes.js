import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import Home from './container/Home';
import LoginContainer from './container/LoginContainer';
import DashboardWrapper from './container/DashboardWrapper';
import UsersIndexContainer from './container/users/UsersIndexContainer';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/login" component={LoginContainer} />
    <Route component={DashboardWrapper}>
      <Route path="/users" component={UsersIndexContainer} />
    </Route>
  </Route>
);

export default routes;
