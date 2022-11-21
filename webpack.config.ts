import * as path from 'path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
//import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

const inputRootDirectory = path.resolve(__dirname, 'source');
//const inputEntryDirectory = path.resolve(inputRootDirectory, 'entry');
const outputDirectory = path.resolve(__dirname, 'dist');

const webpackConfig = (env: { [key: string]: string }, args: any): webpack.Configuration => {
	/** 本番用か */
	const isProduction = args.mode === 'production';

	const conf: webpack.Configuration = {
		mode: args.mode,

		// entry: {
		// 	"page-content": path.join(inputEntryDirectory, `page-content@${env['browser']}.ts`),
		// },
		entry: path.resolve(__dirname, 'index.ts'),

		devtool: isProduction ? false : 'inline-source-map',

		output: {
			filename: '[name].js',
			path: outputDirectory,
		},

		module: {
			rules: [
				// スクリプト
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				// スタイルシート
				{
					test: /(\.(s[ac])ss)|(\.css)$/,
					use: [
						{
							loader: "style-loader",
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: !isProduction,
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: !isProduction,
							}
						}
					],
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [
				'.ts', '.js',
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(inputRootDirectory, 'index.html'),
				filename: 'index.html',
				inject: false,
			}),
			new ImageMinimizerPlugin({
				test: /\.(svg)$/i,
				minimizer: {
					filename: '[name].svg',
					implementation: ImageMinimizerPlugin.svgoMinify,
					options: {
						options: {
							encodeOptions: {
								multipass: true,
								plugins: [
									// see: https://github.com/svg/svgo#default-preset
									"preset-default",
								],
							},
						},
					},
				},
			}),
		],
	};

	if (isProduction) {
		conf.optimization = {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							pure_funcs: [
								'console.assert',
								'console.table',
								'console.dirxml',

								'console.count',
								'console.countReset',

								'console.time',
								'console.timeEnd',
								'console.timeLog',
								'console.timeStamp',

								'console.profile',
								'console.profileEnd',

								'console.trace',
								'console.debug',
								'console.log',
							]
						}
					}
				})
			],
		}
	}

	return conf;
}

export default webpackConfig;

