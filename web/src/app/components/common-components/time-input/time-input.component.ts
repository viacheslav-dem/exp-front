import {Component, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import * as dayjs from 'dayjs';

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
      let date = dayjs(this.value);
      this._hour = date.hour();
      this._minute = date.minute();
    }
  }

  formatTime(time: number): string {
    return time > 9 ? time.toString() : '0' + time;
  }

  onMinuteSelect() {
    if (this.value != null) {
      this.value = dayjs(this.value).minute(this._minute).valueOf();
    } else {
      // Если значение null, создаем новую дату с текущим временем
      let date = dayjs().hour(this._hour).minute(this._minute).second(0).millisecond(0);
      this.value = date.valueOf();
    }
  }

  onHourSelect() {
    if (this.value != null) {
      this.value = dayjs(this.value).hour(this._hour).valueOf();
    } else {
      // Если значение null, создаем новую дату с текущим временем
      let date = dayjs().hour(this._hour).minute(this._minute).second(0).millisecond(0);
      this.value = date.valueOf();
    }
  }
}
