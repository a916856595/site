require('@babel/polyfill');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const resolvePath = dir => path.join(__dirname, '..', dir);

module.exports = {
  entry: {
    main: ['@babel/polyfill', path.join(__dirname, '../main.js')]
  },
  output: {
    path: path.resolve(__dirname, '../../app'),
    filename: 'main-[hash].js'
  },
  resolve: {
    alias: {
      '@libs': resolvePath('libs'),
      '@request': resolvePath('config/request/request.js'),
      '@utilMethods': resolvePath('libs/utilMethods.js'),
      '@nameSpace': resolvePath('config/nameSpace'),
      '@format': resolvePath('config/format.js'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        loader: 'file-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        },
        exclude: /node_modules/
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              'vue-style-loader',
              'css-loader',
              'sass-loader',
              {
                loader: 'sass-resources-loader',      // 此插件为scss提供全局配置
                options: {
                  resources: ['src/common/scss/globalVariable.scss']
                },
              }
            ]
          },
          extractCSS: true,
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template : path.join(__dirname, "../src/views/index.html"),
      filename : 'index.html'
    }),
    new ExtractTextPlugin("main.css"),
  ]
};
