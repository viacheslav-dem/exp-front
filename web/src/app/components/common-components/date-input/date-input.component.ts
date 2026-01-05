import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnChanges, Output, ViewChild, forwardRef, input} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {environment} from "../../../../environments/environment";

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
           [minDate]="minDate()"
           [maxDate]="maxDate()"
           [bsConfig]="bsConfig"
           bsDatepicker
           [(ngModel)]="dateValue"
           (ngModelChange)="onModelChange($event)"
           (bsValueChange)="onChange($event)"
           [placeholder]="placeholder()"
           [placement]="placement()"
           [title]="title()"
           container="body">
  `,
    styles: [],
    providers: [DATE_INPUT_VALUE_ACCESSOR],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DateInputComponent extends ControlComponent<number> implements OnChanges, AfterViewInit {

  readonly minDate = input<Date>(undefined);
  readonly maxDate = input<Date>(undefined);
  readonly dateFormat = input<string>('DD.MM.YYYY');
  readonly placement = input<string>('bottom');

  dateValue: Date;
  @Output() onSelect: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('dateInput', { static: false }) dateInput: ElementRef<HTMLInputElement>;
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
    if (this.dateValue && this.dateInput) {
      requestAnimationFrame(() => {
        this.updateInputDisplay();
      });
    }
  }

  private updateBsConfig() {
    // ngx-bootstrap использует date-fns внутри, поэтому конвертируем формат dayjs (Moment.js) в date-fns
    const dateFnsFormat = this.convertMomentFormatToDateFns(this.dateFormat() || 'DD.MM.YYYY');
    this.bsConfig = {
      dateInputFormat: dateFnsFormat,
      containerClass: 'theme-default',
      showWeekNumbers: false,
      adaptivePosition: true,
      isAnimated: false, // Отключаем анимации, чтобы избежать проблем с NG05105
      returnFocusToInput: true
    };
    this._cdr.markForCheck();
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
      this._cdr.markForCheck();
      // Обновляем отображение после установки значения
      requestAnimationFrame(() => {
        this.updateInputDisplay();
      });
    } else {
      this.dateValue = null;
      this._cdr.markForCheck();
    }
  }

  private updateInputDisplay() {
    if (this.dateInput && this.dateInput.nativeElement && this.dateValue) {
      const formatted = dayjs(this.dateValue).locale('ru').format(this.dateFormat());
      if (this.dateInput.nativeElement.value !== formatted) {
        this.dateInput.nativeElement.value = formatted;
      }
    }
  }

  onModelChange(value: Date) {
    // Workaround: ngx-bootstrap имеет баг с форматированием года
    // Обновляем отображение после того, как ngx-bootstrap обновит значение
    if (value && this.dateInput?.nativeElement) {
      requestAnimationFrame(() => {
        this.updateDisplayValue(value);
      });
    }
  }

  onChange(d: Date) {
    if (d != null) {
      this.value = d.getTime();
      let date: Date = new Date(this.value);
      date.setHours(0, 0, 0, 0);
      this.onSelect.emit(date.getTime());
      
      // Workaround: обновляем отображение после выбора даты
      // Двойной requestAnimationFrame гарантирует обновление после ngx-bootstrap
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.updateDisplayValue(date);
        });
      });
    } else {
      this.value = null;
    }
  }

  /**
   * Обновляет отображаемое значение в input поле
   * Использует dayjs для форматирования с поддержкой формата Moment.js (DD.MM.YYYY)
   */
  private updateDisplayValue(date: Date): void {
    if (this.dateInput?.nativeElement) {
      const formatted = dayjs(date).locale('ru').format(this.dateFormat());
      // Обновляем только если значение отличается (избегаем лишних обновлений)
      if (this.dateInput.nativeElement.value !== formatted) {
        this.dateInput.nativeElement.value = formatted;
      }
    }
  }

  getDate(time: number): Date {
    return time == null ? null : new Date(time);
  }
}
