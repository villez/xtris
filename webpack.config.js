const path = require("path");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: "./build",
    filename: "xytriz.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel-loader",
      query: {
        presets: ["es2015"]
      }
    }, {
      test: /\.css$/,
      loaders: ["style-loader", "css-loader"]
    }]
  }
};
