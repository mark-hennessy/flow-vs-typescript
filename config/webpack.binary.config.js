/* eslint-disable import/no-extraneous-dependencies,import/extensions */
const webpack = require('webpack');

const FILE = 'language_comparison/codingame/skynet/flow/Player.js';

module.exports = {
  entry: ['babel-polyfill', `./src/${FILE}`],
  output: {
    filename: `./out/webpack_binary/${FILE}`,
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
