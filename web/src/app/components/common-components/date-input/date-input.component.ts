import {Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const DATE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateInputComponent),
  multi: true
};

@Component({
  selector: 'app-date-input',
  template: `
    <input type="text"
           class="form-control"
           [minDate]="minDate"
           [maxDate]="maxDate"
           [bsConfig]="{ dateInputFormat: dateFormat, containerClass: 'theme-default', showWeekNumbers:false}"
           bsDatepicker 
           [(ngModel)]="dateValue" 
           (bsValueChange)="onChange($event)"
           [placeholder]="placeholder"
           [placement]="placement"
           [title]="title">
  `,
  styles: [],
  providers: [DATE_INPUT_VALUE_ACCESSOR]
})
export class DateInputComponent extends ControlComponent<number> {

  @Input()
  minDate: Date;
  @Input()
  maxDate: Date;
  @Input()
  dateFormat: string = 'DD.MM.YYYY';
  @Input() placement: string = "bottom";

  dateValue: Date;
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();

  prepareValue(): void {
    if (this._value) {
      this.dateValue = this.getDate(this._value);
    }
  }

  //we need to normalize dates before emit
  onChange(d: Date) {
    if (d != null) {
      this.value = d.getTime();
      let date: Date = new Date(this.value);
      date.setHours(0, 0, 0, 0);
      this.onSelect.emit(date.getTime());
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);

  }
}
