import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {StatsService} from "@app/services/stats.service";
import {StatsDto} from "@app/dto/StatsDto";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-period-stats',
    templateUrl: './period-stats.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class PeriodStatsComponent implements OnInit, AfterViewInit {

  dateFrom: number = dayjs().subtract(1, 'year').valueOf();
  dateTo: number = dayjs().valueOf();
  stats: StatsDto[];
  
  dateFromValue: Date = new Date(this.dateFrom);
  dateToValue: Date = new Date(this.dateTo);
  
  @ViewChild('dateFromInput', { static: false }) dateFromInput: ElementRef<HTMLInputElement>;
  @ViewChild('dateToInput', { static: false }) dateToInput: ElementRef<HTMLInputElement>;
  
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM.yyyy', // для ngx-bootstrap (date-fns формат)
    containerClass: 'theme-default',
    showWeekNumbers: false
  };

  constructor(private _statsService: StatsService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.update();
  }

  ngAfterViewInit(): void {
    // Обновляем отображение после инициализации
    requestAnimationFrame(() => {
      this.updateInputDisplay();
    });
  }

  private updateInputDisplay(): void {
    if (this.dateFromInput?.nativeElement && this.dateFromValue) {
      const formatted = dayjs(this.dateFromValue).locale('ru').format('MM.YYYY');
      if (this.dateFromInput.nativeElement.value !== formatted) {
        this.dateFromInput.nativeElement.value = formatted;
      }
    }
    if (this.dateToInput?.nativeElement && this.dateToValue) {
      const formatted = dayjs(this.dateToValue).locale('ru').format('MM.YYYY');
      if (this.dateToInput.nativeElement.value !== formatted) {
        this.dateToInput.nativeElement.value = formatted;
      }
    }
  }

  update() {
    let dateToExclusive = dayjs(this.dateTo).add(1, 'month').valueOf();
    this._statsService.getStatsByMonths(this.dateFrom, dateToExclusive).subscribe(res => {
      this.stats = res;
      this.cdr?.markForCheck?.();
    });
  }

  changeDateTo(date: Date) {
    if (date) {
      this.dateTo = dayjs(date).startOf('month').valueOf();
      this.dateToValue = new Date(this.dateTo);
      this.update();
      // Обновляем отображение после изменения даты
      requestAnimationFrame(() => {
        if (this.dateToInput?.nativeElement) {
          const formatted = dayjs(date).locale('ru').format('MM.YYYY');
          this.dateToInput.nativeElement.value = formatted;
        }
        this.cdr?.markForCheck?.();
      });
    }
  }

  changeDateFrom(date: Date) {
    if (date) {
      this.dateFrom = dayjs(date).startOf('month').valueOf();
      this.dateFromValue = new Date(this.dateFrom);
      this.update();
      // Обновляем отображение после изменения даты
      requestAnimationFrame(() => {
        if (this.dateFromInput?.nativeElement) {
          const formatted = dayjs(date).locale('ru').format('MM.YYYY');
          this.dateFromInput.nativeElement.value = formatted;
        }
        this.cdr?.markForCheck?.();
      });
    }
  }
}
