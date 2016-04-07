import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import RegisterContainer from './container/RegisterContainer';
import LoginContainer from './container/LoginContainer';
import NewAccountContainer from './container/NewAccountContainer';
import EditAccountContainer from './container/EditAccountContainer';
import NewCompilationContainer from './container/NewCompilationContainer';
import CompilationContainer from './container/CompilationContainer';

import CompilationEmailsContainer from './container/CompilationEmailsContainer';
import AddCompilationEmailsContainer from './container/AddCompilationEmailsContainer';
import ViewCompilationEmailContainer from './container/ViewCompilationEmailContainer';
import EditCompilationEmailContainer from './container/EditCompilationEmailContainer';
import PreviewCompilationEmailContainer from './container/PreviewCompilationEmailContainer';

import CompilationPagesContainer from './container/CompilationPagesContainer';
import ViewCompilationPageContainer from './container/ViewCompilationPageContainer';
import EditCompilationPageContainer from './container/EditCompilationPageContainer';
import PreviewCompilationPageContainer from './container/PreviewCompilationPageContainer';

import CompilationPreviewContainer from './container/CompilationPreviewContainer';

import AdminContainer from './container/AdminContainer';
import AdminDashboardContainer from './container/AdminDashboardContainer';

// components
import Home from './components/Home';
import DashboardWrapper from './components/DashboardWrapper';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/register" component={RegisterContainer}/>
    <Route path="/login" component={LoginContainer}/>
    <Route path="/dashboard" component={DashboardWrapper}/>
    <Route path="/accounts/new" component={NewAccountContainer}/>
    <Route path="/accounts/:id/edit" component={EditAccountContainer}/>
    <Route path="/compilations/new" component={NewCompilationContainer}/>
    <Route component={CompilationContainer}>
      <Route path="/compilations/:compilationId/add-emails" component={AddCompilationEmailsContainer}/>
      <Route path="/compilations/:compilationId/emails" component={CompilationEmailsContainer} />
      <Route component={CompilationEmailsContainer}>
        <Route path="/compilations/:compilationId/emails/:emailId" component={ViewCompilationEmailContainer}/>
        <Route path="/compilations/:compilationId/emails/:emailId/edit" component={EditCompilationEmailContainer}/>
        <Route path="/compilations/:compilationId/emails/:emailId/preview" component={PreviewCompilationEmailContainer}/>
      </Route>
      <Route path="/compilations/:compilationId/pages" component={CompilationPagesContainer} />
      <Route component={CompilationPagesContainer}>
        <Route path="/compilations/:compilationId/pages/:pageId" component={ViewCompilationPageContainer}/>
        <Route path="/compilations/:compilationId/pages/:pageId/edit" component={EditCompilationPageContainer}/>
        <Route path="/compilations/:compilationId/pages/:pageId/preview" component={PreviewCompilationPageContainer}/>
      </Route>
      <Route path="/compilations/:compilationId/preview" component={CompilationPreviewContainer} />
    </Route>
    <Route component={AdminContainer}>
      <Route path="/admin/dashboard" component={AdminDashboardContainer}/>
    </Route>
  </Route>
);

export default routes;
