const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge')

const webpack = require('webpack')

module.exports = (envVars) => {
    const { env } = envVars
    const isProductionMode = env === 'prod' ? true : false

    const common = {
        entry: path.resolve(__dirname, '..', './src/index.tsx'),
        stats: { warnings: false },
        target: "web",
        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '...' ],
            alias: {
                src: path.resolve(__dirname, '..', './src/'),
            },
            fallback: {
                buffer: false
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    use: [ '@svgr/webpack' ],
                },
                {
                    test: /\.(scss|sass|css)$/,
                    use: [
                        {
                            loader: require.resolve("style-loader"),
                        },
                        {
                            loader: require.resolve("css-loader"),
                            options: {
                                importLoaders: 1,
                                url: false
                            }
                        }, {
                            loader: require.resolve("sass-loader"),
                        }
                    ],
                    sideEffects: true
                },
                {
                    test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff(2)?|eot|ttf|otf)$/,
                    type: 'asset/inline',
                },
            ],
        },
        output: {
            path: path.resolve(__dirname, '..', './dist'),
            assetModuleFilename: isProductionMode ? "[name].[contenthash:8][ext]" : "[path][name][ext]",
            chunkFilename: isProductionMode ? "[name].[contenthash:8].chunk.js" : "[name].chunk.js",
            clean: true,
            filename: isProductionMode ? "[name].[contenthash:8].js" : "[name].js",
            globalObject: "this",
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin(),
            new webpack.ProgressPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "..", 'public/index.html'),
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "..", "public/manifest.json"),
                        to: path.resolve(__dirname, "..", "dist/manifest.json"),
                    },
                    {
                        from: path.resolve(__dirname, "..", "public/favicon.ico"),
                        to: path.resolve(__dirname, "..", "dist/favicon.ico"),
                    },
                ]
            }),
        ],
        stats: 'errors-only',
    }

    const envConfig = require(`./webpack.${env}.js`)
    const config = merge(common, envConfig)
    return config
}
