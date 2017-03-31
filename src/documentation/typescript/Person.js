/**
 * A simple Person class created as an example of how to use types.
 */
class Person {
    /**
     * A constructor that demonstrates a param type annotations.
     * @param name the person's name
     */
    constructor(name) {
        this.name = name;
    }
    /**
     * A simple method that demonstrates a return type annotation.
     * @returns a greeting
     */
    getGreeting() {
        return this.getSpecialGreeting();
    }
    /**
     * An internal helper method
     * @returns a special greeting
     */
    getSpecialGreeting() {
        return 'Welcome';
    }
    /**
     * A static method that logs 'Hi' to the console.
     */
    static sayHi() {
        console.log('Hi');
    }
}
const bob = new Person('Bob');
console.log(`${bob.getGreeting()} ${bob.name}`);
Person.sayHi();
//# sourceMappingURL=Person.js.map