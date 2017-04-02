const webpack = require('webpack');

module.exports = {
  entry: ["babel-polyfill", "./src/codingame/skynet/flow/Player.js"],
  output: {
    filename: "./bin/bundle.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  node: {
    fs: "empty"
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
  ]
}
