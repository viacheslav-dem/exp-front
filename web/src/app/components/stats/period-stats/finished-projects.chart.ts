/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {blueClr} from "@app/components/stats/colors";

@Component({
  selector: 'app-finished-projects-chart',
  template: '<highchart [options]="chart"></highchart>'
})
export class FinishedProjectsChart implements OnInit {

  chart: any = Chart.chart().loading().options;

  constructor(private monthYear: MonthYearPipe) {
  }

  ngOnInit(): void {
  }

  @Input() set stats(stats: {["finishedProjects"]: number, ["startDate"]: number}[]) {
    if (!stats) {
      return;
    }
    let allFinishedProjects = stats
      .map(s => s.finishedProjects)
      .reduce((prev, curr) => prev + curr, 0);
    this.chart = Chart.chart('Объекты, прошедшие экспертизу')
      .xAxis(Chart.axis()
        .categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis('Количество')
        .allowDecimals(false))
      .exporting(Chart.exporting()
        .filename('Объекты, прошедшие экспертизу')
        .size(625, 350))
      .legend(true)
      .plotOptions(Chart.lineOptions()
        .dataLabels(Chart.dataLabels()
          .enabled(true)))
      .series(Chart.lineOptions(`Завершено объектов: ${allFinishedProjects}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Завершено объектов: {point.y}`))
        .color(blueClr)
        .data(stats.map(stats => stats.finishedProjects)));
  }
}


