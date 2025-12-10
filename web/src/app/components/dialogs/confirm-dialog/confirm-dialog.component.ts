import {Component, EventEmitter, Output, input} from '@angular/core';
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";

@Component({
    selector: 'app-confirm-dialog',
    template: `
    <div>
      <div class="mb-2">{{message()}}</div>
      @for (field of (fields() ?? []); track field) {
        <div class="form-sub-group">
          <label>{{field.label}}</label>
          <input class="form-control" [type]="field.type" [(ngModel)]="field.value" required [name]="field.name"/>
        </div>
      }
      <div class="text-sm">{{description()}}</div>
      <div class="mt-3">
        <button class="btn btn-primary mr-1" (click)="confirm()">{{okBtnMessage()}}</button>
        <button class="btn btn-dark" (click)="cancel()">{{cancelBtnMessage()}}</button>
      </div>
    </div>
    `,
    standalone: false
})
export class ConfirmDialogComponent {

  readonly message = input<string>('Вы действительно хотите выполнить данную операцию?');
  readonly description = input<string>('Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.');
  readonly okBtnMessage = input<string>('Подтвердить');
  readonly cancelBtnMessage = input<string>('Отмена');
  readonly fields = input<ConfirmDialogField<any>[]>([]);

  @Output() onSave = new EventEmitter<any>();
  @Output() canceled = new EventEmitter();

  confirm() {
    let result = {};
    const fieldsValue = this.fields();
    if (fieldsValue != null && Array.isArray(fieldsValue)) {
      fieldsValue.forEach(field => result[field.name] = field.value);
    }
    this.onSave.next(result);
  }

  cancel() {
    this.canceled.next(null);
  }
}
