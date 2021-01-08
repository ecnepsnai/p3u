const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/renderer/index.tsx',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.html']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'html/index.development.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'node_modules/fontsource-fira-sans/index.css', to: 'fonts/' },
                { from: 'node_modules/fontsource-fira-sans/files/*latin*.woff2', flatten: true, to: 'fonts/files/' },
                { from: 'node_modules/react/umd/react.development.js', to: 'assets/js/' },
                { from: 'node_modules/react-dom/umd/react-dom.development.js', to: 'assets/js/' },
            ]
        })
    ],
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
};
