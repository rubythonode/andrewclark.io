import webpack from 'webpack';
import config from '../webpack.config.client';
import onBuild from './onBuild.js';

const compiler = webpack(config);

compiler.run(onBuild());
