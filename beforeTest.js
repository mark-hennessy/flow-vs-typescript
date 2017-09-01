// This strategy for accessing the global scope works for TS, JS, and Jest.
// eslint-disable-next-line no-new-func
const globalScope = Function('return this')();
globalScope.globalNumber = 7;

// Stub out log functions to reduce noise and make test results easier to read.
console.log = () => {};

// Initialize global namespaces etc.
require('./initModel');
