const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

/**
 * @type import("webpack").Configuration
 */
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "build"),
    open: true,
    port: 4444,
    client: {
      overlay: false,
    },
  },
});
