// @ts-check
"use strict";

// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require("path");
const webpack = require("webpack");

/** @type WebpackConfig */
const webExtensionConfig = {
  mode: "none",
  target: "webworker",
  entry: { extension: "./src/extension.ts" },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
    libraryTarget: "commonjs",
  },
  resolve: {
    mainFields: ["module", "main"],
    extensions: [".ts", ".js"],
    alias: {},
    fallback: { assert: require.resolve("assert") },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: "swc-loader" }],
      },
      {
        test: /\.wasm$/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [new webpack.ProvidePlugin({ process: "process/browser" })],
  externals: { vscode: "commonjs vscode" },
  performance: { hints: false },
  devtool: "nosources-source-map",
};

/** @type WebpackConfig */
const gameConfig = {
  mode: "none",
  entry: { game: "./assets/src/game.ts" },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./assets/dist"),
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
    extensions: [".ts", ".js"],
    alias: {},
    fallback: { assert: require.resolve("assert") },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: "swc-loader" }],
      },
    ],
  },
  plugins: [new webpack.ProvidePlugin({ process: "process/browser" })],

  externals: { vscode: "commonjs vscode" },
  performance: { hints: false },
  devtool: "nosources-source-map",
};

module.exports = [webExtensionConfig, gameConfig];
