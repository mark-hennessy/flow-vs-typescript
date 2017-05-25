// @flow
/* eslint-disable no-undef */

import View from './View';

declare var proto: any;
const Model = proto.com.Model;

export const sayHi = (): string => 'Hi';

export const addNumbers = (a: number, b: number): number => a + b;

// export class Presenter {
//   model: Model = new Model();
//   view: View = new View();
//
//   getNumberAsString(): string {
//     return this.view.getNumberAsString();
//   }
//
//   setNumber(value: number) {
//     this.view.setNumber(value);
//   }
//
//   getRowCount(): number {
//     return this.model.getRowCount();
//   }
// }
