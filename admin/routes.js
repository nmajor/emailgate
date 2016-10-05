import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import Home from './container/Home';
import LoginContainer from './container/LoginContainer';
import DashboardWrapper from './container/DashboardWrapper';

import UsersWrapper from './container/users/UsersWrapper';
import UsersIndexContainer from './container/users/UsersIndexContainer';
import UserShowContainer from './container/users/UserShowContainer';

import CompilationsWrapper from './container/compilations/CompilationsWrapper';
import CompilationsIndexContainer from './container/compilations/CompilationsIndexContainer';
import CompilationShowContainer from './container/compilations/CompilationShowContainer';

import OrdersWrapper from './container/orders/OrdersWrapper';
import OrdersIndexContainer from './container/orders/OrdersIndexContainer';
import OrderShowContainer from './container/orders/OrderShowContainer';

import PurchaseOrdersWrapper from './container/purchaseOrders/PurchaseOrdersWrapper';
import PurchaseOrdersIndexContainer from './container/purchaseOrders/PurchaseOrdersIndexContainer';
import PurchaseOrderShowContainer from './container/purchaseOrders/PurchaseOrderShowContainer';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/logins" component={LoginContainer} />
    <Route component={DashboardWrapper}>
      <Route component={UsersWrapper}>
        <Route path="/users" component={UsersIndexContainer} />
        <Route path="/users/:userId" component={UserShowContainer} />
      </Route>
      <Route component={CompilationsWrapper}>
        <Route path="/compilations" component={CompilationsIndexContainer} />
        <Route path="/compilations/:compilationId" component={CompilationShowContainer} />
      </Route>
      <Route component={OrdersWrapper}>
        <Route path="/orders" component={OrdersIndexContainer} />
        <Route path="/orders/:orderId" component={OrderShowContainer} />
      </Route>
      <Route component={PurchaseOrdersWrapper}>
        <Route path="/purchase-orders" component={PurchaseOrdersIndexContainer} />
        <Route path="/purchase-orders/:purchaseOrderId" component={PurchaseOrderShowContainer} />
      </Route>
    </Route>
  </Route>
);

export default routes;
