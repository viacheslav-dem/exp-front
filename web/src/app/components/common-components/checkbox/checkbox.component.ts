import {Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

@Component({
    selector: 'app-checkbox',
    template: `
    <div class="custom-control custom-checkbox" (click)="check()">
      <input type="checkbox" class="custom-control-input" [(ngModel)]="value">
      <label class="custom-control-label">
        <ng-content></ng-content>
      </label>
    </div>
  `,
    providers: [CHECKBOX_VALUE_ACCESSOR],
    standalone: false
})
export class CheckboxComponent extends ControlComponent<boolean> {

  @Output() onChecked: EventEmitter<boolean> = new EventEmitter<boolean>();

  check() {
    this.value = !this.value;
    this.onChecked.emit(this.value);
  }
}
