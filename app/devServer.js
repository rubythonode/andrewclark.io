import express from 'express';
import webpack from 'webpack';
import config from '../webpack.config.clientDev';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import proxy from 'express-http-proxy';
import url from 'url';

if (process.env.NODE_ENV !== 'development') {
  throw new Error(
    `process.env.NODE_ENV should equal 'development' when running webpack `
  + `dev server`
  );
}

const app = express();

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use('*', proxy('http://localhost:3000', {
  forwardPath: req => {
    return url.parse(req.url).path;
  }
}));

app.listen(3001);
