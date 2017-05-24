const globalScope = Function('return this')();

class Model {
  getRowCount(): number {
    return globalScope.globalNumber;
  }
}


globalScope.proto = {};
globalScope.proto.com = {};
globalScope.proto.com.Model = Model;
