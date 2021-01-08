module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: ['./src/main/main.ts', './src/main/p3u.ts']
    },
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
