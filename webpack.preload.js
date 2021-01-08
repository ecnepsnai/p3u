const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: ['./src/main/preload.js']
    },
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js']
    },
    target: 'electron-preload',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'preload.js',
    },
};
