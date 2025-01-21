/**
 * Created by Ilya on 07.07.2017.
 */
export class Filter<T> {
  key?: string;
  value?: T;
  operation?: string;
  filters?: Filter<any>[] = [];

  constructor(key?: string, value?: T, operation?: string) {
    this.key = key;
    this.value = value;
    this.operation = operation;
  }
}
