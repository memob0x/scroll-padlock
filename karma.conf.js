process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = config => config.set({
    frameworks: [
        'mocha',
        'chai'
    ],

    files: [
        {
            pattern: './test/**/*.mjs',
            type: 'module'
        },

        {
            pattern: './src/**/*.mjs',
            type: 'module'
        }
    ],

    reporters: ['mocha'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    browsers: ['ChromeHeadless'],

    autoWatch: false,

    concurrency: Infinity
});
