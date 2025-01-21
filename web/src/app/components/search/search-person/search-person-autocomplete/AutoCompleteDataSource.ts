import {CompleterData, CompleterItem} from "ng2-completer";
import {Observable, Subject} from "rxjs";

export class AutoCompleteDataSource extends Subject<CompleterItem[]> implements CompleterData {
  constructor(private searchFunc: (term: string) => Observable<CompleterItem[]>) {
    super();
  }

  search(term: string): void {
    this.searchFunc(term).subscribe(res => this.next(res));
  }

  cancel(): void {
  }
}
