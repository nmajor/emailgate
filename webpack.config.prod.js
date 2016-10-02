var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: __dirname + "/client/index.js",
    amdin: __dirname + "/client/admin.js",
  },

  output: {
    path: __dirname + '/public/',
    filename: 'js/[name].bundle.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style", "css?minimize!sass")
      },
      {
        test: /\.jsx*$|\.js*$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ],

    noParse: [
      // Shut off warnings about using pre-built javascript files
      // as Quill.js unfortunately ships one as its `main`.
      /node_modules\/quill\/dist/,

      // Shut off warnings about using pre-built javascript files
      // Have to do this for a react-credit-card module dependency too
      /payment\/lib\/payment.js$/
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      }
    }),
    new ExtractTextPlugin("css/style.css"),
  ],
};
