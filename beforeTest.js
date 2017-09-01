// eslint-disable-next-line jsx-a11y/href-no-hash
// eslint-disable-next-line no-new-func
const globalScope = Function('return this')();
globalScope.globalNumber = 7;
require('./initModel');
