const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: './dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "src/templates", to: "templates"},
                {from: "src/styles", to: "styles"},
                {from: "src/static/images", to: "images"},
                {from: "node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles"},
                {from: "node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "styles"},
                {from: "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff", to: "styles/fonts"},
                {from: "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", to: "styles/fonts"},
                {from: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "scripts"},
                {from: "node_modules/chart.js/dist/chunks/helpers.segment.js", to: "scripts/chunks/helpers.segment.js"},
                {from: "node_modules/chart.js/dist/chart.umd.js", to: "scripts"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};