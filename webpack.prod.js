const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

/**
 * @type import("webpack").Configuration
 */
module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
});
