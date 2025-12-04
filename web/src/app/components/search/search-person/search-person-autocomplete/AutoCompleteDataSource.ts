import {Observable, Subject} from "rxjs";

export class AutoCompleteDataSource<T = any> extends Subject<T[]> {
  constructor(private searchFunc: (term: string) => Observable<T[]>) {
    super();
  }

  search(term: string): void {
    this.searchFunc(term).subscribe(res => this.next(res));
  }

  cancel(): void {
  }
}
