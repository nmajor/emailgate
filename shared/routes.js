import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import RegisterContainer from './container/RegisterContainer';
import LoginContainer from './container/LoginContainer';
// import PostContainer from './container/PostContainer';
import PostDetailView from './container/PostDetailView';

// components
import Home from './components/Home';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/register" component={RegisterContainer}/>
    <Route path="/login" component={LoginContainer}/>
    <Route path="/post/:slug" component={PostDetailView}/>
  </Route>
);

export default routes;
