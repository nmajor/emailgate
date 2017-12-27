import { Route, IndexRoute } from 'react-router';
import React from 'react';

// containers
import App from './container/App';
import Home from './container/Home';
import BuildPostcardContainer from './container/BuildPostcardContainer';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/build" component={BuildPostcardContainer} />
  </Route>
);

export default routes;
