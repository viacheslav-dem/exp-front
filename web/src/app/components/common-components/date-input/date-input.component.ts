import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
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
           [bsConfig]="bsConfig"
           bsDatepicker
           [(ngModel)]="dateValue"
           (bsValueChange)="onChange($event)"
           [placeholder]="placeholder"
           placement="bottom"
           [title]="title"
           container="body">
  `,
  styles: [],
  providers: [DATE_INPUT_VALUE_ACCESSOR]
})
export class DateInputComponent extends ControlComponent<number> implements OnChanges {

  @Input()
  minDate: Date;
  @Input()
  maxDate: Date;
  @Input()
  dateFormat: string = 'dd.MM.yyyy';
  @Input() placement: string = "bottom";

  dateValue: Date;
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();

  bsConfig: any;

  constructor() {
    super();
    this.updateBsConfig();
  }

  ngOnChanges() {
    // Обновляем формат при изменении dateFormat
    this.updateBsConfig();
  }

  private updateBsConfig() {
    this.bsConfig = {
      dateInputFormat: this.dateFormat || 'dd.MM.yyyy',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  prepareValue(): void {
    if (this._value != null) {
      this.dateValue = this.getDate(this._value);
    } else {
      this.dateValue = null;
    }
  }

  //we need to normalize dates before emit
  onChange(d: Date) {
    if (d != null) {
      this.value = d.getTime();
      let date: Date = new Date(this.value);
      date.setHours(0, 0, 0, 0);
      this.onSelect.emit(date.getTime());
    } else {
      // Если дата была очищена, устанавливаем null
      this.value = null;
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);

  }
}
