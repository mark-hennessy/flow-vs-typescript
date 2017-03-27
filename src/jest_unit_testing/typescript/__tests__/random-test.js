"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = require("../random");
describe('sayHi', function () {
    it('should say Hi', function () {
        var message = random_1.sayHi();
        expect(message).toBe('Hi');
    });
});
describe('addNumbers', function () {
    it('should add', function () {
        expect(random_1.addNumbers(5, 2)).toBe(7);
    });
    it('should work with negative numbers', function () {
        expect(random_1.addNumbers(-5, 2)).toBe(-3);
    });
});
