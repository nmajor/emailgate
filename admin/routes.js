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

import SettingsContainer from './container/settings/SettingsContainer';

import CompilationsWrapper from './container/compilations/CompilationsWrapper';
import CompilationsIndexContainer from './container/compilations/CompilationsIndexContainer';
import CompilationShowContainer from './container/compilations/CompilationShowContainer';

import OrdersWrapper from './container/orders/OrdersWrapper';
import OrdersIndexContainer from './container/orders/OrdersIndexContainer';
import OrderShowContainer from './container/orders/OrderShowContainer';

import PurchaseOrdersWrapper from './container/purchaseOrders/PurchaseOrdersWrapper';
import PurchaseOrdersIndexContainer from './container/purchaseOrders/PurchaseOrdersIndexContainer';
import PurchaseOrderShowContainer from './container/purchaseOrders/PurchaseOrderShowContainer';

import PromoCodesWrapper from './container/promoCodes/PromoCodesWrapper';
import PromoCodesIndexContainer from './container/promoCodes/PromoCodesIndexContainer';
import PromoCodesShowContainer from './container/promoCodes/PromoCodesShowContainer';
import PromoCodesNewContainer from './container/promoCodes/PromoCodesNewContainer';
import PromoCodesEditContainer from './container/promoCodes/PromoCodesEditContainer';

import EmailShowContainer from './container/emails/EmailShowContainer';
import PageShowContainer from './container/pages/PageShowContainer';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/login" component={LoginContainer} />
    <Route component={DashboardWrapper}>
      <Route path="emails/:emailId" component={EmailShowContainer} />
      <Route path="pages/:pageId" component={PageShowContainer} />
      <Route component={UsersWrapper}>
        <Route path="/users" component={UsersIndexContainer} />
        <Route path="/users/:userId" component={UserShowContainer} />
      </Route>
      <Route component={CompilationsWrapper}>
        <Route path="/compilations/:compilationId" component={CompilationShowContainer} />
        <Route path="/compilations" component={CompilationsIndexContainer} />
      </Route>
      <Route component={OrdersWrapper}>
        <Route path="/orders/:orderId" component={OrderShowContainer} />
        <Route path="/orders" component={OrdersIndexContainer} />
      </Route>
      <Route component={PurchaseOrdersWrapper}>
        <Route path="/purchase-orders/:purchaseOrderId" component={PurchaseOrderShowContainer} />
        <Route path="/purchase-orders" component={PurchaseOrdersIndexContainer} />
      </Route>
      <Route component={PromoCodesWrapper}>
        <Route path="/promo-codes/new" component={PromoCodesNewContainer} />
        <Route path="/promo-codes/:promoCodeId/edit" component={PromoCodesEditContainer} />
        <Route path="/promo-codes/:promoCodeId" component={PromoCodesShowContainer} />
        <Route path="/promo-codes" component={PromoCodesIndexContainer} />
      </Route>
      <Route path="/settings" component={SettingsContainer} />
    </Route>
  </Route>
);

export default routes;
