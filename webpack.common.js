const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @type import("webpack").Configuration
 */
module.exports = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", "..."],
    alias: {
      "@assets": path.resolve(__dirname, "assets")
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|avif)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        }
      },
      {
        test: /\.(mp3|wav|ogg)$/i,
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
