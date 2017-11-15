const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const webpack = require('webpack');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
  {
    entry: {
      // polyfill: 'babel-polyfill',
      index: PATHS.src,
      // entry: './src/index.js',
      // output: {
      //   path: path.resolve(__dirname, 'dist'),
      //   filename: 'index.js',
      // },
    },
    output: {
      path: PATHS.dist,
      filename: '[name].js',
      library: 'stick-n-slide',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
        template: './template/template.ejs',
      }),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      // }),
    ],
    externals: {
      jquery: {
        commonjs: 'jQuery',
        commonjs2: 'jQuery',
        amd: 'jQuery',
        root: '$',
      },
      $: {
        commonjs: 'jQuery',
        commonjs2: 'jQuery',
        amd: 'jQuery',
        root: '$',
      },
    },
  },
  parts.lintJavaScript({ include: PATHS.src }),
  parts.lintCSS({ include: PATHS.src }),
  parts.loadJavaScript({ include: PATHS.src }),
]);

const productionConfig = merge([
  parts.extractCSS({
    use: ['css-loader', 'fast-sass-loader', parts.autoprefix()],
  }),
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};