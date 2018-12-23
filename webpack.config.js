const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintWebpackPlugin = require("stylelint-webpack-plugin");
const TslintWebpackPlugin = require("tslint-webpack-plugin");

module.exports = (env, options) => {
	var config = {
		entry: {
			app: "./src/index.tsx",
			styles: "./src/index.scss",
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
			alias: {
				pbcsv: path.resolve(__dirname, "src"),
			},
		},
		output: {
			filename: "[name].[chunkhash].js",
			path: path.resolve(__dirname, "dist"),
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: "babel-loader",
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader",
					],
				},
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: ["babel-loader", "ts-loader"],
				},
				{
					test: /\.ttf$/,
					use: {
						loader: "file-loader",
						options: {
							name: "[name].[hash].[ext]",
						},
					},
				},
			],
		},
		optimization: {
			splitChunks: {
				chunks(chunk) {
					return chunk.name !== "styles";
				},
				cacheGroups: {
					vendor: {
						name: "vendor",
						test: /[\\/]node_modules[\\/]/,
					},
				},
			},
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: "src/index.html",
			}),
			new MiniCssExtractPlugin({
				filename: "[name].[contenthash].css",
			}),
			new StylelintWebpackPlugin(),
			new TslintWebpackPlugin({
				files: ["src/**/*.ts", "src/**/*.tsx"],
			}),
		],
		devServer: {
			disableHostCheck: true, // TODO: https://github.com/webpack/webpack-dev-server/issues/1604
		},
	};

	if (options.mode === "development") {
		config.resolve.alias.inferno = path.resolve(
			__dirname,
			"node_modules/inferno/dist/index.dev.esm.js",
		);
	}

	return config;
};
