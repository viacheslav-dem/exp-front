import {DialogComponent} from "@app/components/dialogs/dialog.component";

export class DialogResult<T> {
  value: T;
  dlg: DialogComponent;

  constructor(value: T, dlg: DialogComponent) {
    this.value = value;
    this.dlg = dlg;
  }
}
