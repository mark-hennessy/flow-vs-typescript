/* eslint-disable no-new-func,class-methods-use-this */
const globalScope = Function('return this')();

class Model {
  getRowCount() {
    return globalScope.globalNumber;
  }
}

globalScope.proto = {};
globalScope.proto.com = {};
globalScope.proto.com.Model = Model;
