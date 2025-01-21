import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";

export class ConfirmDialog {

  title: string;
  message: string;
  description: string;
  okBtnMessage: string;
  cancelBtnMessage: string;
  fields: ConfirmDialogField<any>[];

  constructor(title: string, message: string, description: string, okBtnMessage: string, cancelBtnMessage: string, fields: ConfirmDialogField<any>[]) {
    this.title = title;
    this.message = message;
    this.description = description;
    this.okBtnMessage = okBtnMessage;
    this.cancelBtnMessage = cancelBtnMessage;
    this.fields = fields;
  }
}
