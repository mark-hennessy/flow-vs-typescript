class Person {
  constructor(public name: string) {

  }

  getGreeting(): string {
    return this.getSpecialGreeting();
  }

  private getSpecialGreeting(): string {
    return 'Welcome';
  }

  static sayHi() {
    console.log('Hi');
  }

}

const bob = new Person('Bob');
console.log(`${bob.getGreeting()} ${bob.name}`);
Person.sayHi();
