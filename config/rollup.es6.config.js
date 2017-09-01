/* eslint-disable import/no-extraneous-dependencies */
import flow from 'rollup-plugin-flow';

import FLOW_ENTRY_FILE from './shared.config';

export default {
  input: `./src/${FLOW_ENTRY_FILE}`,
  output: {
    file: `./build/rollup-es6/${FLOW_ENTRY_FILE}`,
    format: 'cjs',
  },
  plugins: [
    flow(),
  ],
};
