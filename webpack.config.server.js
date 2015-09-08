import {
  BannerPlugin,
  NormalModuleReplacementPlugin
} from 'webpack';

import baseConfig from './webpack.config.base';
import mergeConfig from './mergeConfig';
import path from 'path';
import fs from 'fs';

const nodeModules = fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1);

const serverConfig = mergeConfig(baseConfig, {
  entry: './app/server.js',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
    libraryTarget: 'commonjs'
  },
  externals: (context, request, callback) => {
    if (nodeModules.some(m => request.startsWith(m))) {
      return callback(null, true);
    }
    callback();
  },
  devtool: process.env.NODE_ENV === 'development'
    ? '#eval-source-map'
    : 'inline',
  plugins: [
    new BannerPlugin(
      `require('source-map-support').install();`,
      { raw: true, entryOnly: false }
    ),
    new NormalModuleReplacementPlugin(/\.css$/, 'node-noop')
  ]
});

export default serverConfig;
