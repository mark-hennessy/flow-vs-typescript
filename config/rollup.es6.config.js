/* eslint-disable import/no-extraneous-dependencies */
import flow from 'rollup-plugin-flow';

import FLOW_ENTRY_FILE from './shared.config';

export default {
  entry: `./src/${FLOW_ENTRY_FILE}`,
  format: 'cjs',
  dest: `./build/rollup-es6/${FLOW_ENTRY_FILE}`,
  plugins: [
    flow(),
  ],
};
