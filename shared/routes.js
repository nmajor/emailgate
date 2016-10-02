import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import Terms from './components/Terms';
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
import CompilationBuildContainer from './container/CompilationBuildContainer';
import CompilationEmailsContainer from './container/CompilationEmailsContainer';
import AddCompilationEmailsContainer from './container/AddCompilationEmailsContainer';
import CompilationTitleContainer from './container/CompilationTitleContainer';
import CompilationMessageContainer from './container/CompilationMessageContainer';
import ViewCompilationEmailContainer from './container/ViewCompilationEmailContainer';
import EditCompilationEmailContainer from './container/EditCompilationEmailContainer';
import PreviewCompilationEmailContainer from './container/PreviewCompilationEmailContainer';
import CompilationPagesContainer from './container/CompilationPagesContainer';
import ViewCompilationPageContainer from './container/ViewCompilationPageContainer';
import EditCompilationPageContainer from './container/EditCompilationPageContainer';
import PreviewCompilationPageContainer from './container/PreviewCompilationPageContainer';
import CompilationPreviewContainer from './container/CompilationPreviewContainer';
import ViewOrderContainer from './container/ViewOrderContainer';
import CompilationCheckoutContainer from './container/CompilationCheckoutContainer';
import AdminContainer from './container/AdminContainer';
import AdminDashboardContainer from './container/AdminDashboardContainer';
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
    <Route path="/terms" component={Terms} />
    <Route path="/about" component={About} />
    <Route path="/register" component={RegisterContainer} />
    <Route path="/login" component={LoginContainer} />
    <Route path="/forgot" component={ForgotPasswordContainer} />
    <Route path="/reset/:token" component={ResetPasswordContainer} />
    <Route path="/cart" component={CartContainer} />
    <Route path="/checkout" component={CheckoutContainer} />
    <Route path="/checkout/confirm" component={CheckoutConfirmContainer} />
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
      <Route path="/compilations/:compilationId/build" component={CompilationBuildContainer} />
      // <Route path="/compilations/:compilationId/preview" component={CompilationPreviewContainer} />
      <Route path="/compilations/:compilationId/build/checkout" component={CompilationCheckoutContainer} />
      <Route path="/compilations/:compilationId/build/emails/:emailId" component={ViewCompilationEmailContainer} />
      <Route path="/compilations/:compilationId/build/emails/:emailId/edit" component={EditCompilationEmailContainer} />
      <Route path="/compilations/:compilationId/build/pages/:pageId" component={ViewCompilationPageContainer} />
      <Route path="/compilations/:compilationId/build/pages/:pageId/edit" component={EditCompilationPageContainer} />
      <Route path="/compilations/:compilationId/build/add-emails/:accountId" component={AddCompilationEmailsContainer} />
      <Route path="/compilations/:compilationId/build/add-emails" component={AddCompilationEmailsContainer} />
      <Route path="/compilations/:compilationId/build/title" component={CompilationTitleContainer} />
      <Route path="/compilations/:compilationId/build/message" component={CompilationMessageContainer} />
      // <Route component={CompilationEmailsContainer}>
        // <Route path="/compilations/:compilationId/build/emails/:emailId/preview" component={PreviewCompilationEmailContainer} />
      // </Route>
      // <Route component={CompilationPagesContainer}>
        // <Route path="/compilations/:compilationId/build/pages/:pageId/preview" component={PreviewCompilationPageContainer} />
      // </Route>
    </Route>

    <Route component={AdminContainer}>
      <Route path="/admin/dashboard" component={AdminDashboardContainer} />
    </Route>
  </Route>
);

export default routes;
