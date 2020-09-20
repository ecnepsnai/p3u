const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: ['./src/main/main.ts', './src/main/p3u.ts']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/main/preload.js', flatten: true },
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: 'ts-loader',
                }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    target: 'electron-main',
};
