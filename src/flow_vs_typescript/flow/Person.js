// @flow
/* eslint-disable no-console */

/**
 * A simple Person class created as an example of how to use flow types.
 * @class
 */
class Person {
  /**
   * A public property that demonstrates a flow type annotation.
   */
  name: string;

  /**
   * A constructor that demonstrates a flow param type annotations.
   * @param name the person's name
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * A simple method that demonstrates a flow return type annotation.
   * @returns {string} a greeting
   */
  getGreeting(): string {
    return this.getSpecialGreeting();
  }

  /**
   * An internal helper method
   * @private
   * @returns {string} a special greeting
   */
  // eslint-disable-next-line class-methods-use-this
  getSpecialGreeting(): string {
    return 'Welcome';
  }

  /**
   * A static method that logs 'Hi' to the console.
   * It's best practice not to use the ': void' flow type annotation explicitly.
   */
  static sayHi() {
    console.log('Hi');
  }
}

const bob = new Person('Bob');
console.log(`${bob.getGreeting()} ${bob.name}`);
Person.sayHi();
