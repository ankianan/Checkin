const path = require('path');

module.exports = {
	entry: './src/main/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode : 'development',
	watch: false,
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ 
					'style-loader',{ 
      					loader: 'css-loader', 
      					options: { importLoaders: 1 } 
      				},
      				'sass-loader'
          		]
			}
		]
	},
	resolve: {
		alias: {
		  common: path.resolve(__dirname, 'src/common')
		}
	}
	
};