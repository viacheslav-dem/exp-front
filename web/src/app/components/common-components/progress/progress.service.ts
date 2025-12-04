import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class ProgressService {

  showProgress: EventEmitter<any> = new EventEmitter();
  hideProgress: EventEmitter<any> = new EventEmitter();

  hideObservable: Observable<any>;
  showObservable: Observable<any>;

  constructor() {
    this.showObservable = this.showProgress.asObservable();
    this.hideObservable = this.hideProgress.asObservable();
  }

  public show() {
    this.showProgress.next(true);
  }

  public hide() {
    this.hideProgress.next(false);
  }
}
