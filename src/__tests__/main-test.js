import { sayHi, addNumbers } from '../main';

describe('sayHi', () => {
  it('should say Hi', () => {
    const message = sayHi();
    expect(message).toBe('Hi');
  });
});

describe('addNumbers', () => {
  it('should add', () => {
    expect(addNumbers(5, 2)).toBe(7);
  });

  it('should work with negative numbers', () => {
    expect(addNumbers(-5, 2)).toBe(-3);
  });
});
