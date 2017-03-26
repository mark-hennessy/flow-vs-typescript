// @flow
/* eslint-disable no-console */

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  getGreeting(): string {
    return this.getSpecialGreeting();
  }

// eslint-disable-next-line class-methods-use-this
  getSpecialGreeting(): string {
    return 'Welcome';
  }

  static sayHi() {
    console.log('Hi');
  }
}

const bob = new Person('Bob');
console.log(`${bob.getGreeting()} ${bob.name}`);
Person.sayHi();
