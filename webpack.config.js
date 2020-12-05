const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const generateHtmlPlugin = (title) => {
    return new HtmlWebpackPlugin({
        title: title,
        filename: `${title.toLowerCase()}.html`,
        // publicPath: `./dist/${title.toLowerCase()}`
    });
}

const config = title => {
    return {
        entry: `./src/content/${title}/index.ts`,
        devtool: 'inline-source-map',
        mode: 'development',
        optimization: {
            minimize: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, `dist/${title}`),
            library: 'bundle',
            publicPath: `./`
        },
        plugins: [generateHtmlPlugin(title)]
    }
}

module.exports = env => {
    let titles = env.paths.split(',')
    return titles.map(x => config(x))
}