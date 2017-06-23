var path = require('path');
var webpack = require('webpack');

var entry = [];
if(process.env.NODE_ENV === 'development') {
    entry.push(
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    );
}

var plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
  })
];
if(process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
	        compress: {
	            warnings: false
	        }
	    })
    );
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
}

var loaders = [];
if(process.env.NODE_ENV === 'development') {
    loaders.push({
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/,
        include: __dirname
    });
} else {
    loaders.push({
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
    });
}

loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    include: path.join(__dirname, '..', '..', 'src')
});

module.exports = {
    devtool: process.env.NODE_ENV === 'development' ? 'eval': undefined,
    entry: entry.concat('./index'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: plugins,
    resolve: {
        alias: {
            'react-textfit': path.join(__dirname, '..', '..', 'src')
        },
        extensions: ['', '.js']
    },
    module: {
        loaders: loaders
    }
};
