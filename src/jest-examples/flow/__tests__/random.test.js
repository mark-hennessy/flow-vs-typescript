import { sayHi, addNumbers, Presenter } from '../random';

describe('greetings', () => {
  test('sayHi should say Hi', () => {
    const message = sayHi();
    expect(message).toBe('Hi');
  });
});

describe('calculations', () => {
  test('adding positive numbers', () => {
    expect(addNumbers(5, 2)).toBe(7);
  });

  test('adding positive and negative numbers', () => {
    expect(addNumbers(-5, 2)).toBe(-3);
  });
});

describe('the presenter', () => {
  let subject;

  beforeEach(() => {
    subject = new Presenter();
  });

  test('interacting with the view and DOM', () => {
    subject.setNumber(3);
    expect(subject.getNumberAsString()).toBe('3');
  });

  test('getting the row count from the model', () => {
    expect(subject.getRowCount()).toBe(7);
  });
});
