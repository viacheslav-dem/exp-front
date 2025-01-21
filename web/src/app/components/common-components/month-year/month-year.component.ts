import {Component, forwardRef} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const MONTH_YEAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthYearComponent),
  multi: true
};

@Component({
  selector: 'app-month-year',
  template: `
    <div class="input-group" style="width: 160px">
      <select class="form-control form-control-sm">
        <option *ngFor="let month of months">{{month}}</option>
      </select>
      <select class="form-control form-control-sm">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
    </div>
  `,
  providers: [MONTH_YEAR_VALUE_ACCESSOR]
})
export class MonthYearComponent extends ControlComponent<number> {

  months = Array(24).map((item, ind) => ind + 1);
}
