// @flow
/* eslint-disable no-undef */

export default class View {
  rootElement: HTMLDivElement;

  constructor() {
    this.rootElement = document.createElement('div');
  }

  getNumberAsString(): string {
    return this.rootElement.getAttribute('data-number') || '';
  }

  setNumber(value: number) {
    this.rootElement.setAttribute('data-number', value.toString(10));
  }
}
