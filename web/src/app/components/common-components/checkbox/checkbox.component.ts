import {ChangeDetectionStrategy, Component, forwardRef, output} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

@Component({
    selector: 'app-checkbox',
    template: `
    <div class="form-check" (click)="check()">
      <input type="checkbox" class="form-check-input" [checked]="value" style="pointer-events: none">
      <label class="form-check-label">
        <ng-content></ng-content>
      </label>
    </div>
  `,
    providers: [CHECKBOX_VALUE_ACCESSOR],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class CheckboxComponent extends ControlComponent<boolean> {

  readonly onChecked = output<boolean>();

  check() {
    this.value = !this.value;
    this.onChecked.emit(this.value);
  }
}
