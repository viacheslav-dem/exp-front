/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit, input} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {blueClr} from "@app/components/stats/colors";
import {ExpertStatsDto} from "@app/dto/ExpertStatsDto";
import {ChartService} from "@app/services/chart.service";

@Component({
    selector: 'app-finished-reviews-sparkline-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class FinishedReviewsSparklineChart implements OnInit {

  readonly height = input<number>(60);
  chart: any = Chart.chart().size(null, this.height()).loading();

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
    let allFinishedProjects = stats
      .map(s => s.finishedProjects)
      .reduce((prev, curr) => prev + curr, 0);
    this.chart = Chart.chart()
      .spacing()
      .size(null, this.height())
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
      })
      .exporting(false)
      .tooltip(Chart.tooltip()
        .hideDelay(0)
        .padding(3))
      .plotOptions(Chart.areaOptions()
        .slimLine()
        .animation(false)
        .fillOpacity(0.1)
        .dataLabels(Chart.dataLabels().enabled(true).allowOverlap(false)))
      .series(Chart.areaOptions(`Количество: ${allFinishedProjects}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Количество: {point.y}`))
        .color(blueClr)
        .data(stats.map(stats => stats.finishedProjects)));
  }
}
