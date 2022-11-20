const path = require('path');

module.exports = {
  mode: "development",
  entry: "./main.tsx",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "."),
    filename: "./bundle.js",
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
}

