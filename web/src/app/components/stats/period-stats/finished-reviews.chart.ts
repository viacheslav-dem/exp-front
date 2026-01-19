/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, OnInit, effect, input} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {StatsDto} from "@app/dto/StatsDto";
import {blueClr} from "@app/components/stats/colors";

@Component({
    selector: 'app-finished-reviews-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class FinishedReviewsChart implements OnInit {

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
    let allFinishedReviews = stats
      .map(s => s.finishedExpertReviews)
      .reduce((prev, curr) => prev + curr, 0);
    this.chart = Chart.chart('Завершённые экспертные заключения')
      .xAxis(Chart.axis().categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis('Количество')
        .allowDecimals(false))
      .exporting(Chart.exporting()
        .filename('Завершённые экспертные заключения')
        .size(625, 350))
      .legend(true)
      .plotOptions(Chart.lineOptions()
        .dataLabels(Chart.dataLabels()
          .enabled(true)))
      .series(Chart.lineOptions(`Завершено экспертных заключений: ${allFinishedReviews}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Завершено экспертных заключений: {point.y}`))
        .color(blueClr)
        .data(stats.map(stats => stats.finishedExpertReviews)));
  }
}
