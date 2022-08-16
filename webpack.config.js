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
        static: {
            directory: path.join(__dirname, './public')
        },
        port: 8080,
    }
}