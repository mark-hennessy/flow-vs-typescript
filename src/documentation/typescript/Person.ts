/**
 * A simple Person class created as an example of how to use types.
 */
class Person {
  /**
   * A constructor that demonstrates a param type annotations.
   * @param name the person's name
   */
  constructor(public name: string) {

  }

  /**
   * A simple method that demonstrates a return type annotation.
   * @returns a greeting
   */
  getGreeting(): string {
    return this.getSpecialGreeting();
  }

  /**
   * An internal helper method
   * @returns a special greeting
   */
  private getSpecialGreeting(): string {
    return 'Welcome';
  }

  /**
   * A static method that logs 'Hi' to the console.
   * It's best practice not to use the ': void' type annotation explicitly.
   */
  static sayHi() {
    console.log('Hi');
  }

}

const bob = new Person('Bob');
console.log(`${bob.getGreeting()} ${bob.name}`);
Person.sayHi();
