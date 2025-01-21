import {Subject} from "rxjs";
import {DialogResult} from "@app/components/dialogs/dialog-result";

export class DialogContainer<T> {
  type: DialogType;
  data: T;
  autoClose: boolean;
  callback: Subject<DialogResult<T>>;

  constructor(type: DialogType, data: T, callback: Subject<DialogResult<T>>, autoClose: boolean = true) {
    this.type = type;
    this.data = data;
    this.callback = callback;
    this.autoClose = autoClose;
  }
}

export enum DialogType {
  USER = 'USER',
  PASSWORD = 'PASSWORD',
  CONFIRM = 'CONFIRM',
  VIEWER = 'VIEWER'
}
