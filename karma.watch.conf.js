const webpackTestConfig = require('./webpack.test.config');
const karmaConf = require('./karma.conf');

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
        browsers: ['Chrome'],
        port: 9876,  // karma web server port
        reporters: ['progress', 'coverage-istanbul'],
        autoWatch: true,
        singleRun: false, // Karma captures browsers, runs the tests and exi
        concurrency: Infinity,
        coverageIstanbulReporter: {
            reports: [ 'text-summary', 'html' ],
            fixWebpackSourcePaths: true
        },
        client: {
            mocha: {
                // change Karma's debug.html to the mocha web reporter
                reporter: 'html'
            }
        }
    });
};