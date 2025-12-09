import {Component, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {setHours, setMinutes, getHours, getMinutes, getTime} from 'date-fns';

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
      let date = new Date(this.value);
      this._hour = getHours(date);
      this._minute = getMinutes(date);
    }
  }

  formatTime(time: number): string {
    return time > 9 ? time.toString() : '0' + time;
  }

  onMinuteSelect() {
    if (this.value != null) {
      this.value = getTime(setMinutes(new Date(this.value), this._minute));
    } else {
      // Если значение null, создаем новую дату с текущим временем
      let date = new Date();
      date.setHours(this._hour, this._minute, 0, 0);
      this.value = getTime(date);
    }
  }

  onHourSelect() {
    if (this.value != null) {
      this.value = getTime(setHours(new Date(this.value), this._hour));
    } else {
      // Если значение null, создаем новую дату с текущим временем
      let date = new Date();
      date.setHours(this._hour, this._minute, 0, 0);
      this.value = getTime(date);
    }
  }
}
