module.exports = {
  entry: "./src/main.js",
  output: {
    path: "./",
    filename: "xytriz.js"
  },
  module: {
    loaders: [{
      exclude: /(node_modules|bower_components)/,
      loader: "babel",
      query: {
        presets: ["es2015"]
      }
    }]
  }
};
