import FLOW_ENTRY_FILE from './shared.config';

module.exports = {
  entry: [`./src/${FLOW_ENTRY_FILE}`],
  output: {
    filename: `./out/webpack-es6/${FLOW_ENTRY_FILE}`,
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'remove-flow-types-loader',
    }],
  },
  node: {
    fs: 'empty',
  },
};
