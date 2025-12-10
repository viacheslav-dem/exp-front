import {Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {addDays, getTime} from 'date-fns';
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
    <input style="padding: 0; margin: 0; border:0; width: 100%"
           bsDaterangepicker
           [(ngModel)]="bsRangeValue"
           (bsValueChange)="onChange($event)"
           [bsConfig]="bsConfig"
           [placeholder]="placeholder"
           [title]="title"
           [outsideClick]="true"
           placement="bottom"
           container="body">
  `,
  providers: [PERIOD_FILTER_CONTROL_VALUE_ACCESSOR]
})
export class DatePeriodComponent extends ControlComponent<DateRange> implements OnChanges {

  @ViewChild(BsDaterangepickerDirective, { static: false }) datepicker: BsDaterangepickerDirective;

  @Input()
  dateFormat: string = 'dd.MM.yyyy';
  bsRangeValue: any[] = [];
  @Input()
  label: string;
  @Output() onSelect: EventEmitter<DateRange> = new EventEmitter<DateRange>();

  bsConfig: any;

  constructor() {
    super();
    this.updateBsConfig();
    // this.debug = true;
  }

  ngOnChanges() {
    this.updateBsConfig();
  }

  private updateBsConfig() {
    const format = this.dateFormat || 'dd.MM.yyyy';
    this.bsConfig = {
      rangeInputFormat: format,
      dateInputFormat: format,
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  // Workaround for positioning bug on re-open
  ngAfterViewInit() {
    if (this.datepicker) {
      const originalShow = this.datepicker.show.bind(this.datepicker);
      this.datepicker.show = () => {
        // Force hide first to reset state
        this.datepicker.hide();
        // Then show with small delay to allow positioning recalculation
        setTimeout(() => originalShow(), 10);
      };
      
      // Принудительно обновляем конфигурацию после инициализации
      // Это может помочь исправить проблему с форматом в ngx-bootstrap 12.0.0
      setTimeout(() => {
        if (this.datepicker && this.datepicker._config) {
          this.datepicker._config.rangeInputFormat = this.dateFormat || 'dd.MM.yyyy';
          this.datepicker._config.dateInputFormat = this.dateFormat || 'dd.MM.yyyy';
        }
      }, 0);
    }
  }


  prepareValue(): void {
    if (this._value != null && this._value.start != null && this._value.end != null) {
      console.log("prepareValue");
      this.bsRangeValue = [this.getDate(this._value.start), this.getDate(this._value.end)];
    } else {
      this.bsRangeValue = [];
    }
  }

  //we need to normalize dates before emit
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
        result.end = getTime(addDays(date, 1));
        this.onSelect.emit(result);
      }
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);
  }
}
