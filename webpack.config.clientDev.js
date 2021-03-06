import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin
} from 'webpack';

import baseConfig from './webpack.config.base';
import mergeConfig from './mergeConfig';
import baseStyleLoaderConfig, { postcssConfig } from './baseStyleConfig';
import path from 'path';

const clientDevConfig = mergeConfig(baseConfig, {
  entry: [
    'webpack-hot-middleware/client',
    './app/client'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin()
  ],
  devtool: 'eval',
  module: {
    loaders: [
      baseStyleLoaderConfig
    ]
  },
  postcss: postcssConfig
});

export default clientDevConfig;
