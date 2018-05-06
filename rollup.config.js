import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { version } from './package.json';

const input = 'src/letsgo.js';
const plugins = [babel()];
const banner = `/* letsGo v${version} | https://letsgojs.com */`;

export default [{
  input,
  output: [{
    banner,
    format: 'es',
    file: 'dist/esm.js',
  }, {
    banner,
    format: 'cjs',
    file: 'dist/cjs.js',
  }],
  plugins,
}, {
  input,
  output: {
    banner,
    format: 'umd',
    name: 'letsgo',
    file: 'dist/letsgo.min.js',
  },
  plugins: [...plugins, uglify({ output: { comments: 'all' }})],
}];
