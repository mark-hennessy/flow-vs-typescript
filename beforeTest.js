/* eslint-disable no-new-func */
const globalScope = Function('return this')();
globalScope.globalNumber = 7;
require('./initModel');
