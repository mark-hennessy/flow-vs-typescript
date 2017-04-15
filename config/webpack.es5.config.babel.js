import FLOW_ENTRY_FILE from './shared.config';

module.exports = {
  entry: ['babel-polyfill', `./src/${FLOW_ENTRY_FILE}`],
  output: {
    filename: `./out/webpack-es5/${FLOW_ENTRY_FILE}`,
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
};
