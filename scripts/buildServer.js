import webpack from 'webpack';
import config from '../webpack.config.server';
import onBuild from './onBuild';
import minimist from 'minimist';
import nodemon from 'nodemon';

const compiler = webpack(config);
const argv = minimist(process.argv.slice(2));

function watch() {
  nodemon({
    execMap: {
      js: 'babel-node'
    },
    script: './build/server',
    ignore: ['*'], // Ignore everything
    watch: ['foo/'], // Watch nothing
    ext: 'noop' // No extensions
  }).on('restart', function() {
    console.log('Restarted!');
  });

  compiler.watch(100, (error, stats) => {
    onBuild()(error, stats);
    nodemon.restart();
  });
}

function build() {
  compiler.run(onBuild());
}

(argv.watch ? watch : build)();
