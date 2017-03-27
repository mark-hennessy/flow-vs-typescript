/**
 * A simple Person class created as an example of how to use types.
 */
var Person = (function () {
    /**
     * A constructor that demonstrates a param type annotations.
     * @param name the person's name
     */
    function Person(name) {
        this.name = name;
    }
    /**
     * A simple method that demonstrates a return type annotation.
     * @returns a greeting
     */
    Person.prototype.getGreeting = function () {
        return this.getSpecialGreeting();
    };
    /**
     * An internal helper method
     * @returns a special greeting
     */
    Person.prototype.getSpecialGreeting = function () {
        return 'Welcome';
    };
    /**
     * A static method that logs 'Hi' to the console.
     */
    Person.sayHi = function () {
        console.log('Hi');
    };
    return Person;
}());
var bob = new Person('Bob');
console.log(bob.getGreeting() + " " + bob.name);
Person.sayHi();
