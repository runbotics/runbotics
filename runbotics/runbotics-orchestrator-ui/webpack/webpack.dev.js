const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: "eval-cheap-module-source-map",
    cache: true,
    devServer: {
        compress: true,
        port: 3000,
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        allowedHosts: 'all',
        historyApiFallback: true,
        open: false,
        static: false,
        watchFiles: "../src/**/*",
        hot: true,
        liveReload: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/scheduler': {
                target: 'http://localhost:4000',
                changeOrigin: true,
            },
            '/ws-ui': {
                target: 'ws://localhost:4000',
                ws: true,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '/ws-bot': {
                target: 'ws://localhost:4000',
                ws: true,
                changeOrigin: true,
                logLevel: 'debug',

            },
        }
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
    ],
}
