'use strict';

const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const name = 'docs';

module.exports = {
    name: name,

    context: path.resolve(__dirname, './'),

    mode: process.env.NODE_ENV || 'development',

    entry: {
        [name]: [
            './js/index.ts',
            './css/index.scss',
        ],
    },

    output: {
        filename: './[name].js',
        path: path.resolve(__dirname, '../docs/assets'),
        publicPath: './assets/',
    },

    watchOptions: {
        ignored: [
            path.resolve(__dirname, './node_modules'),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: './[name].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './images',
                    to: path.resolve(__dirname, '../docs/assets/images'),
                },
            ],
        }),
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, './js'),
                ],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, './css'),
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    resolve: {
        extensions: ['.ts'],
    },

    stats: {
        children: true,
    },

    devtool: 'cheap-source-map',
};
