/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {blueClr, red05Clr} from "@app/components/stats/colors";
import {ExpertStatsDto} from "@app/dto/ExpertStatsDto";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";
import {NumberPipe} from "@app/pipes/number.pipe";
import {ChartService} from "@app/services/chart.service";

@Component({
    selector: 'app-reviews-violation-sparkline-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class ReviewsViolationSparklineChart implements OnInit {

  @Input() height: number = 80;
  chart: any = Chart.chart().size(null, this.height).loading();

  _stats: ExpertStatsDto[] = [];

  constructor(
    private monthYear: MonthYearPipe,
    private _chartService: ChartService,
    private numberFormat: NumberPipe,
  ) {
  }

  ngOnInit(): void {
    this._chartService.resizeEvent.subscribe(_ => this.updateChart());
  }

  updateChart() {
    this.stats = this._stats;
  }

  @Input() set stats(stats: ExpertStatsDto[]) {
    if (!stats) {
      return;
    }
    this._stats = stats;
    let numberFormat = this.numberFormat;
    this.chart = Chart.chart()
      .spacing()
      .size(null, this.height)
      .xAxis(Chart.axis()
        .ticksDisabled()
        .categories(stats.map(stats => this.monthYear.transform(stats.startDate)))
        .minPadding(0)
        .maxPadding(0)
        .crosshair())
      .yAxis(Chart.axis()
        .visible(false))
      .yAxis(Chart.axis()
        .opposite()
        .visible(false)
        .min(0))
      .legend({
        enabled: true,
        margin: 10,
        padding: 0,
      })
      .exporting(false)
      .plotOptions(Chart.columnOptions()
        .animation(false)
        .dataLabels(true))
      .tooltip(Chart.tooltip()
        .hideDelay(0)
        .shared()
        .padding(3))
      .series(Chart.columnOptions('Процент нарушений сроков')
        .data(stats.map(stats => {
          return {
            y: TermsStatsDto.violationsPercent(stats.reviewsTermsStats),
            all: stats.reviewsTermsStats.totalCount,
            count: stats.reviewsTermsStats.violations,
          }
        }))
        .dataLabels(false)
        .tooltip(Chart.tooltip()
          .pointFormatter(function () {
            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: ` +
              `<b>${numberFormat.transform(this.y, 2)}</b> %<br/>` +
              `<span style="color:${this.color}">\u25CF</span> Количество нарушений: <b>${this.count}</b><br/>` +
              `<span style="color:${blueClr}">\u25CF</span> Составлено заключений: <b>${this.all}</b><br/>`;
          }))
        .color(red05Clr))
      .series(Chart.lineOptions('Среднее время заключения')
        .data(stats.map(stats => stats.reviewsTermsStats.averageTime))
        .color(blueClr)
        .yAxis(1)
        .dataLabels(Chart.dataLabels()
          .allowOverlap(false)
          .formatter(function () {
            return numberFormat.transform(this.y, 2) + ' сут';
          })
          .enabled(true))
        .tooltip(Chart.tooltip()
          .valueFormatter(Chart.valueFormat()
            .precision(2)
            .suffix('сут'))));
  }
}
