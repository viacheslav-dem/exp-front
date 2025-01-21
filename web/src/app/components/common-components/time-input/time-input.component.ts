import {Component, forwardRef} from '@angular/core';
import * as moment from "moment";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";

export const TIME_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimeInputComponent),
  multi: true
};

@Component({
  selector: 'app-time-input',
  template: `
    <div>
      <app-dropdown class="btn-group" (onSelected)="onHourSelect()" [options]="allHours" [resetEnabled]="false"
                    [(ngModel)]="_hour" [optionToString]="formatTime"></app-dropdown>
      <app-dropdown class="btn-group" (onSelected)="onMinuteSelect()" [options]="allMinutes"
                    [resetEnabled]="false"
                    [(ngModel)]="_minute" [optionToString]="formatTime"></app-dropdown>
    </div>
  `,
  providers: [TIME_CONTROL_VALUE_ACCESSOR]
})
export class TimeInputComponent extends ControlComponent<number> {

  _hour: number = 0;
  _minute: number = 0;
  allHours: number[];
  allMinutes: number[];


  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.allHours = Array(24).fill(0).map((value, index) => index);
    this.allMinutes = Array(60).fill(0).map((value, index) => index);
  }

  prepareValue() {
    if (this.value != null) {
      let date = moment(this.value);
      this._hour = date.hour();
      this._minute = date.minute();
    }
  }

  formatTime(time: number): string {
    return time > 9 ? time.toString() : '0' + time;
  }

  onMinuteSelect() {
    this.value = moment(this.value).minute(this._minute).valueOf();
  }

  onHourSelect() {
    this.value = moment(this.value).hour(this._hour).valueOf();
  }
}
