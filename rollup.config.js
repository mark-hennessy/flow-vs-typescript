import babel from 'rollup-plugin-babel';

export default {
  entry: './src/codingame/skynet/flow/Player.js',
  format: 'cjs',
  dest: './out/rollup/codingame/skynet/flow/Player.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
