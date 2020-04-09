const webpackTestConfig = require('./webpack.test.config');

module.exports = (config) => {
    config.set({
        frameworks: ['mocha'],
        files: [
            // only specify one entry point
            // and require all tests in there
            'src/test/js/index.js'
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/test/js/index.js': [ 'webpack', 'sourcemap'],
        },

        webpack: webpackTestConfig,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only',
        },
        browsers: ['ChromeHeadless'],
        port: 9876,  // karma web server port
        reporters: ['progress', 'coverage-istanbul'],
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exi
        concurrency: Infinity,
        coverageIstanbulReporter: {
            reports: [ 'text-summary', 'html' ],
            fixWebpackSourcePaths: true
        }
    });
};