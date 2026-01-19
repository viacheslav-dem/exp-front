/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, OnInit, effect, input} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {StatsDto} from "@app/dto/StatsDto";
import {acceptedClr, rejectedClr, returnedClr} from "@app/components/stats/colors";

@Component({
    selector: 'app-review-results-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class ReviewResultsChart implements OnInit {

  chart: any = Chart.chart().loading().options;
  readonly stats = input<StatsDto[] | undefined>(undefined);
  private readonly _statsEffect = effect(() => {
    const stats = this.stats();
    if (!stats) return;
    this.render(stats);
  });

  constructor(private monthYear: MonthYearPipe) {
  }

  ngOnInit(): void {
  }

  private render(stats: StatsDto[]) {
    let allReviewProjectsAccepted = stats
      .map(s => s.expertReviewsProjectAccepted)
      .reduce((prev, curr) => prev + curr, 0);
    let allReviewProjectsRejected = stats
      .map(s => s.expertReviewsProjectRejected)
      .reduce((prev, curr) => prev + curr, 0);
    let allReviewsRejected = stats
      .map(s => s.expertReviewsRejected)
      .reduce((prev, curr) => prev + curr, 0);
    this.chart = Chart.chart('Результаты по экспертным заключениям')
      .xAxis(Chart.axis().categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis('Количество')
        .allowDecimals(false))
      .exporting(Chart.exporting()
        .filename('Результаты по экспертным заключениям')
        .size(625, 350))
      .plotOptions(Chart.columnOptions()
        .dataLabels(Chart.dataLabels()
          .enabled(true)))
      .series(Chart.columnOptions(`Положительные: ${allReviewProjectsAccepted}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Положительные: {point.y}`))
        .color(acceptedClr)
        .data(stats.map(stats => stats.expertReviewsProjectAccepted)))
      .series(Chart.columnOptions(`Отрицательные: ${allReviewProjectsRejected}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Отрицательные: {point.y}`))
        .color(rejectedClr)
        .data(stats.map(stats => stats.expertReviewsProjectRejected)))
      .series(Chart.columnOptions(`Количество отказов экспертам(-ов): ${allReviewsRejected}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Количество отказов экспертам(-ов): {point.y}`))
        .color(returnedClr)
        .data(stats.map(stats => stats.expertReviewsRejected)));
  }
}
