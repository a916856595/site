const webpackBaseConfig = require('./webpack.base.config');
const WebpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = WebpackMerge(webpackBaseConfig, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        hot: true,
        host: '127.0.0.1',
        inline: true,
        open: true,
        port: 90
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: 'css-loader',
                fallback: 'style-loader'
            })
        },{
            test: /\.(scss|sass)$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
                {
                    loader: 'sass-resources-loader',      // 此插件为scss提供全局配置
                    options: {
                        resources: ['src/common/scss/globalVariable.scss']
                    },
                }
            ]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});