/* eslint-disable import/no-extraneous-dependencies,import/extensions */
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const FILE = 'language_comparison/codingame/skynet/flow/Player.js';

export default {
  entry: `./src/${FILE}`,
  format: 'cjs',
  dest: `./out/rollup_binary/${FILE}`,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};
