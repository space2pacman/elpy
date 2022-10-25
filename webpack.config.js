const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'elpy.min.js',
        library: 'Elpy'
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, './public')
            },
            {
                directory: path.join(__dirname, './dist'),
                publicPath: '/dist'
            },
            {
                directory: path.join(__dirname, './examples'),
                publicPath: '/examples'
            }
        ],
        port: 8080,
    }
}