import {Component, input, ChangeDetectionStrategy, output} from '@angular/core';
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-confirm-dialog',
    template: `
    <div>
        <div class="mb-2" [innerHTML]="message()"></div>
      @for (field of (fields() ?? []); track field) {
        <div class="form-sub-group">
          <label>{{field.label}}</label>
          <input class="form-control" [type]="field.type" [(ngModel)]="field.value" required [name]="field.name"/>
        </div>
      }
      <div class="text-sm">{{description()}}</div>
      <div class="mt-3">
        <button class="btn btn-primary me-1" (click)="confirm()">{{okBtnMessage()}}</button>
        @if (cancelBtnMessage()) {
          <button class="btn btn-dark" (click)="cancel()">{{cancelBtnMessage()}}</button>
        }
      </div>
    </div>
    `,
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class ConfirmDialogComponent {

  readonly message = input<string>('Вы действительно хотите выполнить данную операцию?');
  readonly description = input<string>('Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.');
  readonly okBtnMessage = input<string>('Подтвердить');
  readonly cancelBtnMessage = input<string>('Отмена');
  readonly fields = input<ConfirmDialogField<any>[]>([]);

  readonly onSave = output<any>();
  readonly canceled = output<null>();

  confirm() {
    let result = {};
    const fieldsValue = this.fields();
    if (fieldsValue != null && Array.isArray(fieldsValue)) {
      fieldsValue.forEach(field => result[field.name] = field.value);
    }
    this.onSave.emit(result);
  }

  cancel() {
    this.canceled.emit(null);
  }
}
