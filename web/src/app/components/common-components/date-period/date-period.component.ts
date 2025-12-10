import {Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {BsDaterangepickerDirective} from 'ngx-bootstrap/datepicker';

export const PERIOD_FILTER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePeriodComponent),
  multi: true
};

@Component({
    selector: 'app-date-period',
    template: `
    <input #dateInput
           style="padding: 0; margin: 0; border:0; width: 100%"
           bsDaterangepicker
           [(ngModel)]="bsRangeValue"
           (ngModelChange)="onModelChange($event)"
           (bsValueChange)="onChange($event)"
           [bsConfig]="bsConfig"
           [placeholder]="placeholder"
           [title]="title"
           [outsideClick]="true"
           placement="bottom"
           container="body">
  `,
    providers: [PERIOD_FILTER_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class DatePeriodComponent extends ControlComponent<DateRange> implements OnChanges, AfterViewInit {

  @ViewChild(BsDaterangepickerDirective, { static: false }) datepicker: BsDaterangepickerDirective;
  @ViewChild('dateInput', { static: false }) dateInput: ElementRef<HTMLInputElement>;

  @Input()
  dateFormat: string = 'DD.MM.YYYY';
  bsRangeValue: any[] = [];
  @Input()
  label: string;
  @Output() onSelect: EventEmitter<DateRange> = new EventEmitter<DateRange>();

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
      rangeInputFormat: dateFnsFormat,
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
    if (this._value != null && this._value.start != null && this._value.end != null) {
      this.bsRangeValue = [this.getDate(this._value.start), this.getDate(this._value.end)];
    } else {
      this.bsRangeValue = [];
    }
  }

  onModelChange(value: any[]) {
    // Метод для обработки изменений модели
  }

  onChange(d: Date[]) {
    if (d != null && d.length > 1 && d[0] != null && d[1] != null) {
      this.value = new DateRange(d[0].getTime(), d[1].getTime());
      if (this.value.start != null && this.value.end != null) {
        let date: Date = new Date(this.value.start);
        date.setHours(0, 0, 0, 0);
        let result = new DateRange();
        result.start = date.getTime();
        date = new Date(this.value.end);
        date.setHours(0, 0, 0, 0);
        result.end = dayjs(date).add(1, 'day').valueOf();
        this.onSelect.emit(result);
      }
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);
  }
}
