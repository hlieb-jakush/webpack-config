const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const devMode = process.env.NODE_ENV === 'development'
const prodMode = process.env.NODE_ENV === 'production'

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: ['@babel/polyfill', './scripts/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: devMode ? '[name].js' : '[name].[hash].js',
    },
    resolve: {
        extensions: ['.js', '.css', '.scss']
    },
    optimization: {
        minimize: prodMode,
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        port: 3000,
        hot: devMode
    },
    devtool: devMode ? 'source-map' : '',
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './assets',
                    to: path.resolve(__dirname, 'build'),
                    noErrorOnMissing: true
                },

            ],
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: devMode ? [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    'eslint-loader'
                ] : [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
}