const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge.merge(common, {
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.production.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'node_modules/react/umd/react.production.min.js', to: 'assets/js/' },
                { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: 'assets/js/' },
            ]
        }),
    ],
});
