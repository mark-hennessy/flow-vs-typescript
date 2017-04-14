/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';

import FLOW_ENTRY_FILE from './shared.config';

module.exports = {
  entry: ['babel-polyfill', `./src/${FLOW_ENTRY_FILE}`],
  output: {
    filename: `./out/webpack-binary/${FLOW_ENTRY_FILE}`,
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
