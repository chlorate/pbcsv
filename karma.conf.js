const path = require("path");
const webpack = require("webpack");

// mobx fix: Fix "there are multiple mobx instances active" error:
// https://github.com/mobxjs/mobx/issues/1097#issuecomment-323698853
module.exports = function(config) {
	config.set({
		browsers: ["ChromeHeadless", "FirefoxHeadless"],
		frameworks: ["jasmine"],
		reporters: ["junit", "progress"],
		files: [
			"node_modules/mobx/lib/mobx.umd.js", // mobx fix
			"src/**/*.spec.ts",
		],
		mime: {
			"text/x-typescript": ["ts", "tsx"],
		},
		preprocessors: {
			"**/*.spec.ts": ["webpack", "sourcemap"],
		},
		junitReporter: {
			outputDir: "junit/karma",
			outputFile: "results.xml",
		},
		webpack: {
			mode: "development",
			externals: ["mobx"], // mobx fix
			resolve: {
				extensions: [".tsx", ".ts", ".js"],
				alias: {
					inferno: path.resolve(
						__dirname,
						"node_modules/inferno/dist/index.dev.esm.js",
					),
					pbcsv: path.resolve(__dirname, "src"),
				},
			},
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: ["babel-loader", "ts-loader"],
					},
				],
			},
			plugins: [
				// Partially fix source maps with Typescript:
				// https://github.com/webpack-contrib/karma-webpack/issues/109#issuecomment-224961264
				new webpack.SourceMapDevToolPlugin({
					filename: null,
					test: /\.[jt]sx?($|\?)/i,
				}),
			],
		},
	});
};
