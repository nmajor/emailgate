var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: __dirname + "/client/index.js",

  output: {
    path: __dirname + '/static/dist/',
    filename: 'bundle.js',
    publicPath: '/dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
          test: /\.scss$/,
          loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      },
      {
        test: /\.jsx*$/,
        exclude: /node_modules/,
        loader: 'babel',
      }
    ],

    // Shut off warnings about using pre-built javascript files
    // as Quill.js unfortunately ships one as its `main`.
    noParse: /node_modules\/quill\/dist/
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
    new ExtractTextPlugin("app.css"),
  ],
};
