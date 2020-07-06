const path = require('path');
const commonConfig = require('./webpack.config');
module.exports = Object.assign({}, commonConfig, {
	watch: true
})