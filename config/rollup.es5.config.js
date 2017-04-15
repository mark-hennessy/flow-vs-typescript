/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';

import FLOW_ENTRY_FILE from './shared.config';

export default {
  entry: `./src/${FLOW_ENTRY_FILE}`,
  format: 'cjs',
  dest: `./out/rollup-es5/${FLOW_ENTRY_FILE}`,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
