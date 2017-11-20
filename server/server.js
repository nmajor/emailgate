require('dotenv').config();
if (process.env.NODE_ENV === 'production') { require('newrelic'); } // eslint-disable-line global-require

// if (typeof window === 'undefined') {
//   global.window = {};
// }

import { getRandomImageUrl } from '../experience/helpers';

import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import passport from 'passport';

import appInitialState from '../shared/initialState';
import adminInitialState from '../admin/initialState';
import experienceInitialState from '../experience/initialState';

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
import * as experienceConfigureStore from '../experience/redux/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// Import required modules
import appRoutes from '../shared/routes';
import adminRoutes from '../admin/routes';
import experienceRoutes from '../experience/routes';
import { fetchComponentData } from './util/fetchData';
import index from './routes/index.routes';
import api from './routes/api.routes';
import webhook from './routes/webhook.routes';
import oath2 from './routes/oath2.routes';
import mailer from './routes/mailer.routes';
import socketEvents from './events/index';
import sessionMiddleware from './session-middleware';

import { mainPage, adminPage, experiencePage } from './render';

import User from './models/user';
import Compilation from './models/compilation';

passport.use(User.createStrategy());

// import LocalStrategy from 'passport-local';
// passport.use(new LocalStrategy({
//   usernameField: 'email',
// },
// (email, password, done) => {
//   User.findOne({ email }, (err, user) => {
//     if (err) { return done(err); }
//     return done(null, user);
//   });
// }
// ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

import io from './io';
socketEvents(io);
io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res, next); });

// Apply body Parser and server public assets and routes

app.use(bodyParser.json({
  limit: '20mb',
  verify: (req, res, buf, encoding) => {
    if (req.originalUrl.match(/^\/webhook/)) {
      req.rawBody = buf.toString(encoding);
    }
  },
}));
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
  const domains = ['missionarymemoir', 'localhost:8000'];
  const domainParts = req.headers.host.split('.');
  const subdomain = domains.indexOf(domainParts[0]) > -1 ? null : domainParts[0];

  if (subdomain === 'app' || !subdomain) {
    renderReact(req, res, { subdomain: 'app' });
  } else if (subdomain === 'admin') {
    renderReact(req, res, { subdomain: 'admin' });
  } else {
    Compilation.findOne({ slug: subdomain })
    .then((compilation) => {
      if (compilation) {
        renderReact(req, res, { subdomain: 'experience', compilation });
      } else {
        return res.status(404).sendfile('./public/404.html');
      }
    });
  }
});

function renderReact(req, res, props) {
  const subdomain = props.subdomain;

  let routes = experienceRoutes;
  let renderPage = experiencePage;
  let initialState = experienceInitialState;
  let configureStore = experienceConfigureStore;

  if (subdomain === 'admin') {
    routes = adminRoutes;
    renderPage = adminPage;
    initialState = adminInitialState;
    configureStore = adminConfigureStore;
  } else if (subdomain === 'app') {
    routes = appRoutes;
    renderPage = mainPage;
    initialState = appInitialState;
    configureStore = appConfigureStore;
  } else {
    initialState.compilation = props.compilation;
    initialState.config = {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
    initialState.postcard = {
      image: { url: getRandomImageUrl() }, // eslint-disable-line global-require
    };
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
}

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
