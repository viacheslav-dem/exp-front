import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {DoubleRange} from "@app/components/common-components/page-and-filter/model/Range";

export const NUMBER_RANGE_FILTER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberRangeComponent),
  multi: true
};

@Component({
  selector: 'app-number-range-filter',
  template: `
    <ng-container *ngIf="value!=null">
      <input numberInput type="text" [attr.name]="name+'_start'" [(ngModel)]="value.start"
             class="form-control" style="width:75px; display: inline-block;"/>
      <span>-</span>
      <input numberInput type="text" [attr.name]="name+'_end'" [(ngModel)]="value.end"
             class="form-control" style="width:75px; display:inline-block"/>
    </ng-container>
  `,
  providers: [NUMBER_RANGE_FILTER_CONTROL_VALUE_ACCESSOR]
})
export class NumberRangeComponent extends ControlComponent<DoubleRange> {

  @Input()
  name: string;
}
