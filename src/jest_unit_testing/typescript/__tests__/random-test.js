// The .js file extension is needed because the jest code coverage tool is not setup to understand TypeScript.
import { sayHi, addNumbers } from '../random.js';

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
