import express from 'express';

import path from 'path';
import wrap from './wrapAsync';
import renderAppToString from './renderAppToString';

const app = express();

app.use('/static', express.static(path.resolve(__dirname, '../build')));

app.get('/', wrap(async (req, res) => {
  const renderedApp = await renderAppToString();
  const html =
`<!doctype html>
<html>
  <head>
    <link href='https://fonts.googleapis.com/css?family=Fira+Sans' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/static/normalize.css">
    <link rel="stylesheet" href="/static/styles.css">
  </head>
  <body>
    <div id="root">${renderedApp}</div>
  </body>
  <script src="${process.env.BUNDLE_PATH || '/static/bundle.js'}"></script>
</html>`;

  res.set('Content-type', 'text/html');
  res.send(html);
}));

app.listen(3000);
