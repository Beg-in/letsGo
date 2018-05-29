import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { version } from './package.json';

const input = 'src/index.js';
const plugins = [resolve(), babel({
  plugins: ['external-helpers'],
})];
const banner = `/* letsGo v${version} | MIT license | https://letsgojs.com */`;

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
  }, {
    banner,
    format: 'umd',
    name: 'letsGo',
    file: 'dist/letsgo.js',
  }],
  plugins,
}, {
  input,
  output: {
    banner,
    format: 'umd',
    name: 'letsGo',
    file: 'dist/letsgo.min.js',
  },
  plugins: [...plugins, uglify({ output: { comments: 'all' } })],
}];
