import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div>
      <div class="mb-2">{{message}}</div>
      <div class="form-sub-group" *ngFor="let field of fields">
        <label>{{field.label}}</label>
        <input class="form-control" [type]="field.type" [(ngModel)]="field.value" required [name]="field.name"/>
      </div>
      <div class="text-sm italic">{{description}}</div>
      <div class="mt-3">
        <button class="btn btn-primary mr-1" (click)="confirm()">{{okBtnMessage}}</button>
        <button class="btn btn-dark" (click)="cancel()">{{cancelBtnMessage}}</button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {

  @Input() message: string = 'Вы действительно хотите выполнить данную операцию?';
  @Input() description: string = 'Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.';
  @Input() okBtnMessage: string = 'Подтвердить';
  @Input() cancelBtnMessage: string = 'Отмена';
  @Input() fields: ConfirmDialogField<any>[] = [];

  @Output() onSave = new EventEmitter<any>();
  @Output() canceled = new EventEmitter();

  confirm() {
    let result = {};
    if (this.fields != null)
      this.fields.forEach(field => result[field.name] = field.value);
    this.onSave.next(result);
  }

  cancel() {
    this.canceled.next();
  }
}
