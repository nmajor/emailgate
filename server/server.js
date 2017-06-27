require('dotenv').config();
if (process.env.NODE_ENV === 'production') { require('newrelic'); } // eslint-disable-line global-require

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
import socketEvents from './events/index';
import sessionMiddleware from './session-middleware';

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
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet">

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

        <script>var GA_TRACKING_ID='${process.env.GA_TRACKING_ID}'</script>
        <script src="/js/app.bundle.js"></script>

        <!-- Theme Javascript Files -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>        <script src="/js/bootstrap.min.js"></script>
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="/js/ie10-viewport-bug-workaround.js"></script>

        <!-- Stripe Javascript Files -->
        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
        <script type="text/javascript">
          Stripe.setPublishableKey('${process.env.STRIPE_PUBLISHABLE_KEY}');
        </script>

        <!--Start of Tawk.to Script-->
        <script type="text/javascript">
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/591c6a9c76be7313d291d516/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
        </script>
        <!--End of Tawk.to Script-->

      </body>
    </html>
  `;
};

const renderAdminPage = (html, renderedState) => {
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
        ${cssInclude}
        <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>

        <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Kaushan+Script" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,200,300,400" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:100,300,400,500" rel="stylesheet">

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

        <script src="/js/admin.bundle.js"></script>

        <!-- Theme Javascript Files -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="/js/ie10-viewport-bug-workaround.js"></script>
      </body>
    </html>
  `;
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res) => {
  let routes = appRoutes;
  let renderPage = renderFullPage;
  let initialState = appInitialState;
  let configureStore = appConfigureStore;

  if (req.headers.host.substring(0, 6) === 'admin.') {
    routes = adminRoutes;
    renderPage = renderAdminPage;
    initialState = adminInitialState;
    configureStore = adminConfigureStore;
  }

  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => { // eslint-disable-line consistent-return
    if (err) {
      return res.status(500).end('Internal server error');
    }

    if (!renderProps) {
      return res.status(404).end('Not found!');
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
