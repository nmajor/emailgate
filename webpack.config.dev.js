var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',

  entry: [
    'webpack-hot-middleware/client',
    __dirname + '/client/index.js',
  ],

  output: {
    path: __dirname + '/dist/',
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
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
        query: {
          presets: ['react-hmre'],
        },
      },
      // {
      //   test: /\.json$/,
      //   loader: 'json',
      // },
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true)
      }
    }),
  ],
};
