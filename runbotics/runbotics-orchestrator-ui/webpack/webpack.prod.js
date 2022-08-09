module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: "all",
            name: false
        },
        runtimeChunk: true
    },
    plugins: [
    ],
}