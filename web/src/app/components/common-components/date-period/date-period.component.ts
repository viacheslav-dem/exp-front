import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, forwardRef, input, output, viewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {BsDaterangepickerDirective} from 'ngx-bootstrap/datepicker';
import {environment} from "../../../../environments/environment";

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
           [placeholder]="placeholder()"
           [title]="title()"
           [outsideClick]="true"
           placement="bottom"
           container="body">
  `,
    providers: [PERIOD_FILTER_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DatePeriodComponent extends ControlComponent<DateRange> implements OnChanges, AfterViewInit {

  readonly datepicker = viewChild(BsDaterangepickerDirective);
  readonly dateInput = viewChild<ElementRef<HTMLInputElement>>('dateInput');

  readonly dateFormat = input<string>('DD.MM.YYYY');
  bsRangeValue: any[] = [];
  readonly label = input<string>(undefined);
  readonly onSelect = output<DateRange>();

  bsConfig: any;

  constructor(private _cdr: ChangeDetectorRef) {
    super();
    this.updateBsConfig();
  }

  ngOnChanges() {
    this.updateBsConfig();
    this._cdr.markForCheck();
  }

  ngAfterViewInit() {
    // Обновляем отображение после инициализации если есть значение
    if (this.bsRangeValue && this.bsRangeValue.length === 2 && this.dateInput()) {
      requestAnimationFrame(() => {
        this.updateInputDisplay();
      });
    }
  }

  private updateBsConfig() {
    // ngx-bootstrap/chronos использует Moment.js-совместимый формат (YYYY, DD, MM)
    // НЕ конвертируем в date-fns формат, т.к. это вызывает баг с парсингом года
    const format = this.dateFormat() || 'DD.MM.YYYY';
    this.bsConfig = {
      rangeInputFormat: format,
      dateInputFormat: format,
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
    this._cdr.markForCheck();
  }

  prepareValue(): void {
    if (this._value != null && this._value.start != null && this._value.end != null) {
      this.bsRangeValue = [this.getDate(this._value.start), this.getDate(this._value.end)];
      this._cdr.markForCheck();
      // Обновляем отображение после установки значения
      requestAnimationFrame(() => {
        this.updateInputDisplay();
      });
    } else {
      this.bsRangeValue = [];
      this._cdr.markForCheck();
    }
  }

  private updateInputDisplay() {
    const dateInput = this.dateInput();
    if (dateInput && dateInput.nativeElement && this.bsRangeValue && this.bsRangeValue.length === 2) {
      const startDate = this.bsRangeValue[0];
      const endDate = this.bsRangeValue[1];
      if (startDate && endDate) {
        const formatted = dayjs(startDate).locale('ru').format(this.dateFormat()) + 
                         ' - ' + 
                         dayjs(endDate).locale('ru').format(this.dateFormat());
        if (dateInput.nativeElement.value !== formatted) {
          dateInput.nativeElement.value = formatted;
        }
      }
    }
  }

  onModelChange(value: any[]) {
    // Workaround: ngx-bootstrap имеет баг с форматированием года
    // Обновляем отображение после того, как ngx-bootstrap обновит значение
    if (value && value.length === 2 && value[0] && value[1] && this.dateInput()?.nativeElement) {
      requestAnimationFrame(() => {
        this.updateDisplayValue(value);
      });
    }
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
        
        // Workaround: обновляем отображение после выбора даты
        // Используем исходные даты из d для отображения
        // Двойной requestAnimationFrame гарантирует обновление после ngx-bootstrap
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.updateDisplayValue(d);
          });
        });
      }
    }
  }

  /**
   * Обновляет отображаемое значение в input поле
   * Использует dayjs для форматирования с поддержкой формата Moment.js (DD.MM.YYYY)
   */
  private updateDisplayValue(dates: Date[]): void {
    const dateInput = this.dateInput();
    if (dateInput?.nativeElement && dates && dates.length === 2 && dates[0] && dates[1]) {
      const formatted = dayjs(dates[0]).locale('ru').format(this.dateFormat()) + 
                       ' - ' + 
                       dayjs(dates[1]).locale('ru').format(this.dateFormat());
      // Обновляем только если значение отличается (избегаем лишних обновлений)
      if (dateInput.nativeElement.value !== formatted) {
        dateInput.nativeElement.value = formatted;
      }
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);
  }
}
