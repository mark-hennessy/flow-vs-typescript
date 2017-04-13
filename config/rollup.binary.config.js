/* eslint-disable import/no-extraneous-dependencies,import/extensions */
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './src/codingame/skynet/flow/Player.js',
  format: 'cjs',
  dest: './out/rollup_binary/codingame/skynet/flow/Player.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};
