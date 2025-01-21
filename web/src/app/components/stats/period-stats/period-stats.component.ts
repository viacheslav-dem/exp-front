import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {StatsService} from "@app/services/stats.service";
import {StatsDto} from "@app/dto/StatsDto";
import * as moment from "moment";

@Component({
  selector: 'app-period-stats',
  templateUrl: './period-stats.component.html',
})
export class PeriodStatsComponent implements OnInit {

  dateFrom: number = moment().add(-1, 'year').valueOf();
  dateTo: number = moment().valueOf();
  stats: StatsDto[];
  @ViewChild("dateFromInput") dateFromInput: ElementRef;
  @ViewChild("dateToInput") dateToInput: ElementRef;

  constructor(private _statsService: StatsService) {
  }

  ngOnInit(): void {
    this.dateFromInput.nativeElement.onchange = (e) => this.changeDateFrom(e.target.value);
    this.dateToInput.nativeElement.onchange = (e) => this.changeDateTo(e.target.value);
    this.update();
  }

  update() {
    let dateToExclusive = moment(this.dateTo).add(1, 'month').valueOf();
    this._statsService.getStatsByMonths(this.dateFrom, dateToExclusive).subscribe(res => this.stats = res);
  }

  changeDateTo(dateTo) {
    this.dateTo = moment(dateTo, 'MMMM YYYY').valueOf();
    this.update();
  }

  changeDateFrom(dateFrom) {
    this.dateFrom = moment(dateFrom, 'MMMM YYYY').valueOf();
    this.update();
  }
}
