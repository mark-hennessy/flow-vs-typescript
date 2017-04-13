/* eslint-disable import/no-extraneous-dependencies,import/extensions */
const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src/codingame/skynet/flow/Player.js'],
  output: {
    filename: './out/webpack/codingame/skynet/flow/Player.js',
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
  }
};
