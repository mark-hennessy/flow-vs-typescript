import babel from 'rollup-plugin-babel';

const FILE = 'language_comparison/codingame/skynet/flow/Player.js';

export default {
  entry: `./src/${FILE}`,
  format: 'cjs',
  dest: `./out/rollup/${FILE}`,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
