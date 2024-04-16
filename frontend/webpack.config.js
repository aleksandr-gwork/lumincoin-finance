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
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles"},
                {from: "node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "styles"},
                {from: "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff", to: "styles/fonts"},
                {from: "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", to: "styles/fonts"},
                {from: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "scripts"},
                {from: "node_modules/chart.js/dist/chart.js", to: "scripts"},
                {from: "static/images", to: "images"}
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