import Model = proto.com.Model;
import View from './View';

export const sayHi = (): string => 'Hi';

export const addNumbers = (a: number, b: number): number => a + b;

export class Presenter {
  private model: Model = new Model();
  private view: View = new View();

  getNumberAsString(): string {
    return this.view.getNumberAsString();
  }

  setNumber(value: number): void {
    this.view.setNumber(value);
  }

  getRowCount(): number {
    return this.model.getRowCount();
  }
}
