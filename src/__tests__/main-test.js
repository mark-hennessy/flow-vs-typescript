import sayHi from '../main';

describe('main', () => {
  it('should say Hi', () => {
    const message = sayHi();
    expect(message).toBe('Hi');
  });

  it('should make sense', () => {
    expect(2).toBe(2);
  });
});
