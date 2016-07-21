require('dotenv').config();
if (process.env.NODE_ENV === 'production') { require('newrelic'); } // eslint-disable-line global-require

import kue from 'kue';
import kueUi from 'kue-ui';

import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import socketIo from 'socket.io';
import session from 'express-session';
import passport from 'passport';

import connectMongo from 'connect-mongo';
const ConnectMongo = connectMongo(session);


import initialState from '../shared/initialState';
import socketEvents from './events/index';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../shared/redux/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// Import required modules
import routes from '../shared/routes';
import { fetchComponentData } from './util/fetchData';
import index from './routes/index.routes';
import api from './routes/api.routes';
import oath2 from './routes/oath2.routes';

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = Promise;

import User from './models/user';
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const sessionSecret = process.env.SESSION_SECRET || 'supercat';
// Define session middleware
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: false,
  store: new ConnectMongo({
    url: process.env.MONGO_URL,
    mongoose_connection: mongoose.connections[0],
  }),
});

// Socket.io
const io = socketIo();
socketEvents(io);
io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res, next); });

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cookieParser());
app.use(Express.static(path.resolve(__dirname, '../public')));
app.use('/', index);
app.use('/api', api);
app.use('/oath2', oath2);


kueUi.setup({
  apiURL: '/kue/api', // IMPORTANT: specify the api url
  baseURL: '/kue', // IMPORTANT: specify the base url
  updateInterval: 1000, // Optional: Fetches new data every 5000 ms
});

// Mount kue JSON api
app.use('/kue/api', kue.app);
// Mount UI
app.use('/kue', kueUi.app);

// Render Initial HTML
const renderFullPage = (html, renderedState) => {
  const cssPath = process.env.NODE_ENV === 'production' ? '/css/style.css' : '';
  const cssInclude = cssPath ? `<link rel=\"stylesheet\" href=${cssPath} />` : '';
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>myemailbook.com</title>

        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link href="/css/font-awesome.min.css" rel="stylesheet">
        <link href="/css/custom-animations.css" rel="stylesheet">
        <link href="/css/landing.css" rel="stylesheet">
        ${cssInclude}
        <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
      </head>
      <body>
        <div id="root">${html}</div>

        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(renderedState)};
        </script>

        <script src="/js/bundle.js"></script>

        <!-- Theme Javascript Files -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>        <script src="/js/bootstrap.min.js"></script>
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="/js/ie10-viewport-bug-workaround.js"></script>

        <!-- Stripe Javascript Files -->
        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
        <script type="text/javascript">
          Stripe.setPublishableKey('${process.env.STRIPE_PUBLISHABLE_KEY}');
        </script>

      </body>
    </html>
  `;
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => { // eslint-disable-line consistent-return
    if (err) {
      return res.status(500).end('Internal server error');
    }

    if (!renderProps) {
      return res.status(404).end('Not found!');
    }

    initialState.user = req.user || {};
    const store = configureStore(initialState);

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params, req.headers.cookie)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();

        res.status(200).end(renderFullPage(initialView, finalState));
      })
      .catch(() => { // eslint-disable-line no-shadow
        res.end(renderFullPage('Error', {}));
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


export default app;
