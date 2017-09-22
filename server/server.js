require('dotenv').config();
if (process.env.NODE_ENV === 'production') { require('newrelic'); } // eslint-disable-line global-require

// if (typeof window === 'undefined') {
//   global.window = {};
// }

import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import passport from 'passport';

import appInitialState from '../shared/initialState';
import adminInitialState from '../admin/initialState';

// Initialize the Express App
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
  // Webpack Requirements
  const webpack = require('webpack'); // eslint-disable-line global-require
  const config = require('../webpack.config.dev');  // eslint-disable-line global-require
  const webpackDevMiddleware = require('webpack-dev-middleware');  // eslint-disable-line global-require
  const webpackHotMiddleware = require('webpack-hot-middleware');  // eslint-disable-line global-require
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import * as appConfigureStore from '../shared/redux/configureStore';
import * as adminConfigureStore from '../admin/redux/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// Import required modules
import appRoutes from '../shared/routes';
import adminRoutes from '../admin/routes';
import { fetchComponentData } from './util/fetchData';
import index from './routes/index.routes';
import api from './routes/api.routes';
import webhook from './routes/webhook.routes';
import oath2 from './routes/oath2.routes';
import mailer from './routes/mailer.routes';
import socketEvents from './events/index';
import sessionMiddleware from './session-middleware';

import { mainPage, adminPage } from './render';

import User from './models/user';
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

import io from './io';
socketEvents(io);
io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res, next); });

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cookieParser());
app.use(Express.static(path.resolve(__dirname, '../public')));
app.use('/', index);
app.use('/api', api);
app.use('/webhook', webhook);
app.use('/oath2', oath2);

if (process.env.NODE_ENV !== 'production') {
  app.use('/mailer', mailer);
}

// Server Side Rendering based on routes matched by React-router.
app.use((req, res) => {
  let routes = appRoutes;
  let renderPage = mainPage;
  let initialState = appInitialState;
  let configureStore = appConfigureStore;

  if (req.headers.host.substring(0, 6) === 'admin.') {
    routes = adminRoutes;
    renderPage = adminPage;
    initialState = adminInitialState;
    configureStore = adminConfigureStore;
  }

  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => { // eslint-disable-line consistent-return
    if (err) {
      return res.status(500).sendfile('./public/503.html');
    }

    if (!renderProps) {
      return res.status(404).sendfile('./public/404.html');
    }

    initialState.user = req.user || {};
    const store = configureStore.configureStore(initialState);

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params, req.headers.cookie)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();

        res.status(200).end(renderPage(initialView, finalState));
      })
      .catch((err) => { // eslint-disable-line no-shadow
        console.log('An error when rendering page', err, err.stack);
        initialState.user = req.user || {};

        res.end(mainPage('Error', initialState));
      });
  });
});

const server = http.createServer(app);
io.attach(server);

// start app
server.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${process.env.PORT}! Build something amazing!`); // eslint-disable-line
  }
});

import schedule from 'node-schedule';
import { activitySummary } from './jobs';

if (process.env.NODE_ENV === 'production') {
  schedule.scheduleJob('0 1 * * *', activitySummary);
}

export default app;
