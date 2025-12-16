import {ChangeDetectionStrategy, Component, forwardRef, input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {DoubleRange} from "@app/components/common-components/page-and-filter/model/Range";
import {environment} from "../../../../environments/environment";

export const NUMBER_RANGE_FILTER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberRangeComponent),
  multi: true
};

@Component({
    selector: 'app-number-range-filter',
    template: `
    @if (value!=null) {
      <input numberInput type="text" [attr.name]="name()+'_start'" [(ngModel)]="value.start"
        class="form-control" style="width:75px; display: inline-block;"/>
        <span>-</span>
        <input numberInput type="text" [attr.name]="name()+'_end'" [(ngModel)]="value.end"
          class="form-control" style="width:75px; display:inline-block"/>
        }
    `,
    providers: [NUMBER_RANGE_FILTER_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: environment.features.onPush.numberRange ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class NumberRangeComponent extends ControlComponent<DoubleRange> {

  readonly name = input<string>(undefined);
}
