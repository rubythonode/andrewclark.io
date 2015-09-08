import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config.base';
import mergeConfig from './mergeConfig';
import baseStyleLoaderConfig, { postcssConfig } from './baseStyleConfig';
import path from 'path';

const styleLoaderConfig = {
  ...baseStyleLoaderConfig,
  loaders: undefined,
  loader: ExtractTextPlugin.extract(...baseStyleLoaderConfig.loaders)
};

const clientConfig = mergeConfig(baseConfig, {
  entry: [
    './app/client'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      styleLoaderConfig
    ]
  },
  postcss: postcssConfig,
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true
      },
      mangle: true,
      screw_ie8: true
    })
  ],
});

export default clientConfig;
