import path from 'path';
import webpack from 'webpack';

export default {
	module : {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel-loader'],
				exclude: /node_modules/
			}, {
				test: /\.json$/,
				loader: 'json-loader'
			}, {
				test: /\.scss$/,
				loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'
			},
			{ test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
         { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
         { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
         { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
         { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' }
		]
	},
	output : {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		libraryTarget: 'commonjs2'
	},
	resolve : {
		extensions: ['','.js','.jsx','scss','.json'],
		packageMains: ['webpack','browser','web','browserify',['jam', 'main'],'main']
	},
	sassLoader : {
		data: '@import "' + path.resolve(__dirname, 'app/styles/theme.scss') + '";'
	},
	plugins : [
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
			jquery: 'jquery'
		})
	],
	externals : [
		// put your node 3rd party libraries which can't be built with webpack here
		// (mysql, mongodb, and so on..)
	]
};
