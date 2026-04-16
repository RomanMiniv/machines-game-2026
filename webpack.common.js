const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @type import("webpack").Configuration
 */
module.exports = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", "..."],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|avif|json)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        }
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
