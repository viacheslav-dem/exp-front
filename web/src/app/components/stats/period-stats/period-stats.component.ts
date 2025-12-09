import {Component, OnInit} from "@angular/core";
import {StatsService} from "@app/services/stats.service";
import {StatsDto} from "@app/dto/StatsDto";
import {subYears, getTime, addMonths, startOfMonth} from 'date-fns';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-period-stats',
  templateUrl: './period-stats.component.html',
})
export class PeriodStatsComponent implements OnInit {

  dateFrom: number = getTime(subYears(new Date(), 1));
  dateTo: number = getTime(new Date());
  stats: StatsDto[];
  
  dateFromValue: Date = new Date(this.dateFrom);
  dateToValue: Date = new Date(this.dateTo);
  
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM.yyyy',
    containerClass: 'theme-default',
    showWeekNumbers: false
  };

  constructor(private _statsService: StatsService) {
  }

  ngOnInit(): void {
    this.update();
  }

  update() {
    let dateToExclusive = getTime(addMonths(new Date(this.dateTo), 1));
    this._statsService.getStatsByMonths(this.dateFrom, dateToExclusive).subscribe(res => this.stats = res);
  }

  changeDateTo(date: Date) {
    if (date) {
      this.dateTo = getTime(startOfMonth(date));
      this.update();
    }
  }

  changeDateFrom(date: Date) {
    if (date) {
      this.dateFrom = getTime(startOfMonth(date));
      this.update();
    }
  }
}
