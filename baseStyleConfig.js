import autoprefixer from 'autoprefixer';

export default {
  test: /\.css$/,
  loaders: ['style', 'css?modules!postcss']
};

export function postcssConfig() {
  return [
    autoprefixer
  ];
}
