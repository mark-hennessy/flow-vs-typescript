/* eslint-disable import/no-extraneous-dependencies,import/extensions */
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

import FLOW_ENTRY_FILE from './shared.config';

export default {
  input: `./src/${FLOW_ENTRY_FILE}`,
  output: {
    file: `./build/rollup-es5-binary/${FLOW_ENTRY_FILE}`,
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};
