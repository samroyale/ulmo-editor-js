var url = require('url'),
    proxy = require('proxy-middleware')
    historyApiFallback = require('connect-history-api-fallback');

var proxyOptions = url.parse('http://localhost:8081/api');
proxyOptions.route = '/api';

var dest = './build', src = './src';

module.exports = {
    browserSync: {
        server: {
            baseDir: [dest, src],
            middleware: [proxy(proxyOptions), historyApiFallback()]
        },
        files: [
            dest + '/**'
        ]
    },
    less: {
        src: src + '/less/main.less',
        watch: [
            src + '/less/**'
        ],
        dest: dest + "/css"
    },
    markup: {
        src: src + "/www/**",
        dest: dest
    },
    browserify: {
        // Enable source maps
        debug: true,
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: src + '/app/app.jsx',
            dest: dest + "/js",
            outputName: 'app.js'
        }]
    }
};
