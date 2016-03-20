import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import RegisterContainer from './container/RegisterContainer';
import LoginContainer from './container/LoginContainer';
import NewAccountContainer from './container/NewAccountContainer';
import EditAccountContainer from './container/EditAccountContainer';
import NewCompilationContainer from './container/NewCompilationContainer';
import CompilationAddEmailsContainer from './container/CompilationAddEmailsContainer';
import CompilationEditEmailsContainer from './container/CompilationEditEmailsContainer';
import DashboardWrapper from './components/DashboardWrapper';
// import PostContainer from './container/PostContainer';
import PostDetailView from './container/PostDetailView';
// components
import Home from './components/Home';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/register" component={RegisterContainer}/>
    <Route path="/login" component={LoginContainer}/>
    <Route path="/dashboard" component={DashboardWrapper}/>
    <Route path="/accounts/new" component={NewAccountContainer}/>
    <Route path="/accounts/:id/edit" component={EditAccountContainer}/>
    <Route path="/compilations/new" component={NewCompilationContainer}/>
    <Route path="/compilations/:id/add-emails" component={CompilationAddEmailsContainer}/>
    <Route path="/compilations/:id/edit-emails" component={CompilationEditEmailsContainer}/>
    <Route path="/post/:slug" component={PostDetailView}/>
  </Route>
);

export default routes;
