const commonConfig = require('./webpack.config');
const path = require('path');

module.exports = Object.assign({}, commonConfig, {
	watch: false,
	devtool: 'inline-source-map',
	module: {
		rules: [...commonConfig.module.rules,
			// instrument only testing sources with Istanbul
			{
				test: /\.js$/,
				use: {
					loader: 'istanbul-instrumenter-loader',
					options: {
						esModules: true
					}
				},
				include: path.resolve('src/main/'),
			}
		]
	}
});