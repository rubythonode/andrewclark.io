import path from 'path';

export default {
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: path.resolve(__dirname, 'node_modules'),
      include: path.resolve(__dirname)
    }]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
