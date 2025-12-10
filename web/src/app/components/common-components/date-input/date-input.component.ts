import {Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export const DATE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateInputComponent),
  multi: true
};

@Component({
    selector: 'app-date-input',
    template: `
    <input #dateInput
           type="text"
           class="form-control"
           [minDate]="minDate"
           [maxDate]="maxDate"
           [bsConfig]="bsConfig"
           bsDatepicker
           [(ngModel)]="dateValue"
           (ngModelChange)="onModelChange($event)"
           (bsValueChange)="onChange($event)"
           [placeholder]="placeholder"
           placement="bottom"
           [title]="title"
           container="body">
  `,
    styles: [],
    providers: [DATE_INPUT_VALUE_ACCESSOR],
    standalone: false
})
export class DateInputComponent extends ControlComponent<number> implements OnChanges, AfterViewInit {

  @Input()
  minDate: Date;
  @Input()
  maxDate: Date;
  @Input()
  dateFormat: string = 'DD.MM.YYYY';
  @Input() placement: string = "bottom";

  dateValue: Date;
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('dateInput', { static: false }) dateInput: ElementRef<HTMLInputElement>;
  bsConfig: any;

  constructor() {
    super();
    this.updateBsConfig();
  }

  ngOnChanges() {
    this.updateBsConfig();
  }

  ngAfterViewInit() {
    // Метод для будущих расширений
  }

  private updateBsConfig() {
    // ngx-bootstrap использует date-fns внутри, поэтому конвертируем формат dayjs (Moment.js) в date-fns
    const dateFnsFormat = this.convertMomentFormatToDateFns(this.dateFormat || 'DD.MM.YYYY');
    this.bsConfig = {
      dateInputFormat: dateFnsFormat,
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  /**
   * Конвертирует формат dayjs/Moment.js (DD.MM.YYYY) в формат date-fns (dd.MM.yyyy)
   * для совместимости с ngx-bootstrap (который использует date-fns внутри)
   */
  private convertMomentFormatToDateFns(momentFormat: string): string {
    return momentFormat
      .replace(/DD/g, 'dd')
      .replace(/YYYY/g, 'yyyy')
      .replace(/MM/g, 'MM')
      .replace(/D/g, 'd')
      .replace(/Y/g, 'y');
  }

  prepareValue(): void {
    if (this._value != null) {
      this.dateValue = this.getDate(this._value);
    } else {
      this.dateValue = null;
    }
  }

  onModelChange(value: Date) {
    // Метод для обработки изменений модели
  }

  onChange(d: Date) {
    if (d != null) {
      this.value = d.getTime();
      let date: Date = new Date(this.value);
      date.setHours(0, 0, 0, 0);
      this.onSelect.emit(date.getTime());
    } else {
      this.value = null;
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);
  }
}
