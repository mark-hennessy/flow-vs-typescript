/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';

import FLOW_ENTRY_FILE from './shared.config';

export default {
  input: `./src/${FLOW_ENTRY_FILE}`,
  output: {
    file: `./build/rollup-es5/${FLOW_ENTRY_FILE}`,
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
