import babel from 'rollup-plugin-babel';

import FLOW_ENTRY_FILE from './shared.config';

export default {
  entry: `./src/${FLOW_ENTRY_FILE}`,
  format: 'cjs',
  dest: `./out/rollup/${FLOW_ENTRY_FILE}`,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
