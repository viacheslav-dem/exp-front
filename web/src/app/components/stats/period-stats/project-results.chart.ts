/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {StatsDto} from "@app/dto/StatsDto";
import {acceptedClr, rejectedClr, returnedClr} from "@app/components/stats/colors";

@Component({
    selector: 'app-project-results-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class ProjectResultsChart implements OnInit {

  chart: any = Chart.chart().loading().options;

  constructor(private monthYear: MonthYearPipe) {
  }

  ngOnInit(): void {
  }

  @Input() set stats(stats: StatsDto[]) {
    if (!stats) {
      return;
    }
    let allProjectAccepted = stats
      .map(s => s.projectsAccepted)
      .reduce((prev, curr) => prev + curr, 0);
    let allProjectRejected = stats
      .map(s => s.projectsRejected)
      .reduce((prev, curr) => prev + curr, 0);
    let allProjectReturned = stats
      .map(s => s.projectsReturned)
      .reduce((prev, curr) => prev + curr, 0);
    this.chart = Chart.chart('Результаты по объектам экспертизы')
      .xAxis(Chart.axis().categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis('Количество')
        .allowDecimals(false))
      .exporting(Chart.exporting()
        .filename('Результаты по объектам экспертизы')
        .size(625, 350))
      .plotOptions(Chart.columnOptions()
        .dataLabels(Chart.dataLabels()
          .enabled(true)))
      .series(Chart.columnOptions(`Рекомендованные: ${allProjectAccepted}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Рекомендованные: {point.y}`))
        .color(acceptedClr)
        .data(stats.map(stats => stats.projectsAccepted)))
      .series(Chart.columnOptions(`Не рекомендованные: ${allProjectRejected}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Не рекомендованные: {point.y}`))
        .color(rejectedClr)
        .data(stats.map(stats => stats.projectsRejected)))
      .series(Chart.columnOptions(`Возвращённые: ${allProjectReturned}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Возвращённые: {point.y}`))
        .color(returnedClr)
        .data(stats.map(stats => stats.projectsReturned)));
  }
}
