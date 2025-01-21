/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {acceptedClr, rejectedClr, returnedClr} from "@app/components/stats/colors";
import {ExpertStatsDto} from "@app/dto/ExpertStatsDto";
import {ChartService} from "@app/services/chart.service";

@Component({
  selector: 'app-review-results-sparkline-chart',
  template: '<highchart [options]="chart"></highchart>'
})
export class ReviewResultsSparklineChart implements OnInit {

  @Input() height: number = 80;
  chart: any = Chart.chart().size(null, this.height).loading();

  _stats: ExpertStatsDto[] = [];

  constructor(
    private monthYear: MonthYearPipe,
    private _chartService: ChartService,
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
    let allProjectsAccepted = stats
      .map(s => s.projectsAccepted)
      .reduce((prev, curr) => prev + curr, 0);
    let allProjectsRejected = stats
      .map(s => s.projectsRejected)
      .reduce((prev, curr) => prev + curr, 0);
    let allReviewsRejected = stats
      .map(s => s.reviewsRejected)
      .reduce((prev, curr) => prev + curr, 0);
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
      .legend({
        enabled: true,
        margin: 10,
        padding: 0,
        itemDistance: 5
      })
      .exporting(false)
      .tooltip(Chart.tooltip()
        .hideDelay(0)
        .padding(3))
      .plotOptions(Chart.columnOptions()
        .animation(false)
        .dataLabels(Chart.dataLabels().enabled(true).allowOverlap(false)))
      .series([
        Chart.columnOptions(`Положительные: ${allProjectsAccepted}`)
          .tooltip(Chart.tooltip()
            .pointFormat(`<span style="color:{point.color}">\u25CF</span> Положительные: {point.y}`))
          .color(acceptedClr)
          .data(stats.map(stats => stats.projectsAccepted)),
        Chart.columnOptions(`Отрицательные: ${allProjectsRejected}`)
          .tooltip(Chart.tooltip()
            .pointFormat(`<span style="color:{point.color}">\u25CF</span> Отрицательные: {point.y}`))
          .color(rejectedClr)
          .data(stats.map(stats => stats.projectsRejected)),
        Chart.columnOptions(`Количество отказов эксперту(-ом): ${allReviewsRejected}`)
          .tooltip(Chart.tooltip()
            .pointFormat(`<span style="color:{point.color}">\u25CF</span> Количество отказов эксперту(-ом): {point.y}`))
          .color(returnedClr)
          .data(stats.map(stats => stats.reviewsRejected)),
      ]);
  }
}
