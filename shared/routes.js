import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import About from './components/About';
import RegisterContainer from './container/RegisterContainer';
import LoginContainer from './container/LoginContainer';
import ForgotPasswordContainer from './container/ForgotPasswordContainer';
import ResetPasswordContainer from './container/ResetPasswordContainer';
import NewAccountContainer from './container/NewAccountContainer';
import EditAccountContainer from './container/EditAccountContainer';
import NewCompilationContainer from './container/NewCompilationContainer';
import CompilationContainer from './container/CompilationContainer';
import CartContainer from './container/CartContainer';
import CheckoutContainer from './container/CheckoutContainer';
import CheckoutConfirmContainer from './container/CheckoutConfirmContainer';
import NewAddressContainer from './container/NewAddressContainer';
import EditAddressContainer from './container/EditAddressContainer';
import CompilationPreNextContainer from './container/CompilationPreNextContainer';
import CompilationPostNextContainer from './container/CompilationPostNextContainer';
import CompilationBuildContainer from './container/CompilationBuildContainer';
import CompilationLoginContainer from './container/CompilationLoginContainer';
import CompilationRegisterContainer from './container/CompilationRegisterContainer';
import AddCompilationEmailsContainer from './container/AddCompilationEmailsContainer';
import CompilationNewAccountContainer from './container/CompilationNewAccountContainer';
import CompilationTitleContainer from './container/CompilationTitleContainer';
import CompilationMessageContainer from './container/CompilationMessageContainer';
import ViewCompilationEmailContainer from './container/ViewCompilationEmailContainer';
import EditCompilationEmailContainer from './container/EditCompilationEmailContainer';
import ViewCompilationPageContainer from './container/ViewCompilationPageContainer';
import EditCompilationPageContainer from './container/EditCompilationPageContainer';
import ViewOrderContainer from './container/ViewOrderContainer';
import OrderThanksContainer from './container/OrderThanksContainer';
import CompilationCheckoutContainer from './container/CompilationCheckoutContainer';
import DashboardContainer from './container/DashboardContainer';
import DashboardNavWrapper from './container/DashboardNavWrapper';
import CompilationsDashboardContainer from './container/CompilationsDashboardContainer';
import EmailAccountsDashbaordContainer from './container/EmailAccountsDashboardContainer';
import AccountDashboardContainer from './container/AccountDashboardContainer';
import OrdersDashboardContainer from './container/OrdersDashboardContainer';
import AddressesDashboardContainer from './container/AddressesDashboardContainer';

// components
import Home from './components/Home';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/privacy" component={Privacy} />
    <Route path="/terms" component={Terms} />
    <Route path="/about" component={About} />
    <Route path="/register" component={RegisterContainer} />
    <Route path="/login" component={LoginContainer} />
    <Route path="/forgot" component={ForgotPasswordContainer} />
    <Route path="/reset/:token" component={ResetPasswordContainer} />
    <Route path="/cart" component={CartContainer} />
    <Route path="/checkout/confirm" component={CheckoutConfirmContainer} />
    <Route path="/checkout" component={CheckoutContainer} />
    <Route path="/checkout/:step" component={CheckoutContainer} />
    <Route path="/orders/:id/thanks" component={OrderThanksContainer} />
    <Route path="/orders/:id" component={ViewOrderContainer} />
    <Route path="/addresses/new" component={NewAddressContainer} />
    <Route path="/addresses/:id/edit" component={EditAddressContainer} />
    <Route path="/accounts/new" component={NewAccountContainer} />
    <Route path="/accounts/:id/edit" component={EditAccountContainer} />
    <Route path="/compilations/new" component={NewCompilationContainer} />

    <Route component={DashboardNavWrapper}>
      <Route path="/dashboard" component={DashboardContainer} />
      <Route path="/dashboard/compilations" component={CompilationsDashboardContainer} />
      <Route path="/dashboard/email-accounts" component={EmailAccountsDashbaordContainer} />
      <Route path="/dashboard/orders" component={OrdersDashboardContainer} />
      <Route path="/dashboard/account" component={AccountDashboardContainer} />
      <Route path="/dashboard/addresses" component={AddressesDashboardContainer} />
    </Route>

    <Route component={CompilationContainer}>
      <Route path="/compilations/:compilationId/pre-next" component={CompilationPreNextContainer} />
      <Route path="/compilations/:compilationId/post-next" component={CompilationPostNextContainer} />
      <Route path="/compilations/:compilationId/build" component={CompilationBuildContainer} />
      <Route path="/compilations/:compilationId/build/emails/:emailId" component={ViewCompilationEmailContainer} />
      <Route path="/compilations/:compilationId/build/emails/:emailId/edit" component={EditCompilationEmailContainer} />
      <Route path="/compilations/:compilationId/build/pages/:pageId" component={ViewCompilationPageContainer} />
      <Route path="/compilations/:compilationId/build/pages/:pageId/edit" component={EditCompilationPageContainer} />
      <Route path="/compilations/:compilationId/build/message" component={CompilationMessageContainer} />

      <Route path="/compilations/:compilationId/build/login" component={CompilationLoginContainer} />
      <Route path="/compilations/:compilationId/build/login/:next" component={CompilationLoginContainer} />
      <Route path="/compilations/:compilationId/build/register" component={CompilationRegisterContainer} />
      <Route path="/compilations/:compilationId/build/register/:next" component={CompilationRegisterContainer} />

      <Route path="/compilations/:compilationId/title" component={CompilationTitleContainer} />
      <Route path="/compilations/:compilationId/checkout" component={CompilationCheckoutContainer} />
      <Route path="/compilations/:compilationId/add-emails/new-account" component={CompilationNewAccountContainer} />
      <Route path="/compilations/:compilationId/add-emails/:accountId" component={AddCompilationEmailsContainer} />
      <Route path="/compilations/:compilationId/add-emails" component={AddCompilationEmailsContainer} />
    </Route>
  </Route>
);

export default routes;
