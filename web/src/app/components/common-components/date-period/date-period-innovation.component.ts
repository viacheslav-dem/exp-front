import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import * as moment from "moment";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from "ngx-bootstrap";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {DatePeriodComponent} from "@app/components/common-components/date-period/date-period.component";

defineLocale('ru', ruLocale);
export const PERIOD_FILTER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePeriodInnovationComponent),
    multi: true
};

@Component({
    selector: 'app-date-period-innovation',
    template: `
    <ng-container>
      <input style="padding: 0; margin: 0; border:0; width: 100%"
             bsDaterangepicker
             [(ngModel)]="bsRangeV"
             (bsValueChange)="onChange($event)"
             [bsConfig]="{ dateInputFormat: dateFormat, containerClass: 'theme-default', showWeekNumbers:false }"
             [placeholder]="placeholder"
             [title]="title">
    </ng-container>
  `,
    providers: [PERIOD_FILTER_CONTROL_VALUE_ACCESSOR]
})
export class DatePeriodInnovationComponent extends ControlComponent<DateRange> {

    @Input()
    dateFormat: string = 'DD.MM.YYYY';
    bsRangeV: any[] = [];
    @Input()
    label: string;
    @Output() onSelect: EventEmitter<DateRange> = new EventEmitter<DateRange>();

    constructor(private _localeService: BsLocaleService) {
        super();
        // this.debug = true;
        this._localeService.use('ru');
    }


    prepareValue(): void {
        if (this._value) {
            this.bsRangeV = [this.getDate(this._value.start), this.getDate(this._value.end)];
        }
    }

    //we need to normalize dates before emit
    onChange(d: Date[]) {
        if (d != null && d.length > 1 && d[0] != null && d[1] != null) {
            this.value = new DateRange(d[0].getTime(), d[1].getTime());
            let date: Date = new Date(this.value.start);
            date.setHours(0, 0, 0, 0);
            let result = new DateRange();
            result.start = date.getTime();
            date = new Date(this.value.end);
            date.setHours(0, 0, 0, 0);
            result.end = moment(date).add(1, 'days').valueOf();
            this.onSelect.emit(result);
        }
    }

    getDate(time: number): Date {
        return time == null ? null : new Date(time);
    }
}
