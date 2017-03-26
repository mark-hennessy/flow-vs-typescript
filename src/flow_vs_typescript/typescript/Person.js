var Person = (function () {
    function Person(name) {
        this.name = name;
    }
    Person.prototype.getGreeting = function () {
        return this.getSpecialGreeting();
    };
    Person.prototype.getSpecialGreeting = function () {
        return 'Welcome';
    };
    Person.sayHi = function () {
        console.log('Hi');
    };
    return Person;
}());
var bob = new Person('Bob');
console.log(bob.getGreeting() + " " + bob.name);
Person.sayHi();
