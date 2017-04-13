/* eslint-disable import/no-extraneous-dependencies,import/extensions */
const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src/codingame/skynet/flow/Player.js'],
  output: {
    filename: './out/webpack_binary/codingame/skynet/flow/Player.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ],
};
