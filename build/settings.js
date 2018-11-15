module.exports = {
    sourcemaps: {
        loadMaps: false,
        largeFile: false
    },
    sass: {
        outputStyle: 'expanded'
    },
    rollup: {
        format: 'umd'
    },
    hbs: {
        bustCache: true
    },
    babel: {
        ignore: ['node_modules/', 'dist/'],
        babelrcRoots: ['../../']
    }
};
