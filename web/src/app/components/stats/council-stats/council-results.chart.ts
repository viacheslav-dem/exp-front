/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, OnInit, effect, input} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {acceptedClr, rejectedClr, returnedClr, returnedWithoutExpertiseClr} from "@app/components/stats/colors";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";

@Component({
    selector: 'app-council-results-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class CouncilResultsChart implements OnInit {

  chart: any = Chart.chart().loading().options;
  readonly stats = input<CouncilStatsResponseDTO[] | undefined>(undefined);
  private readonly _statsEffect = effect(() => {
    const stats = this.stats();
    if (!stats) return;
    this.render(stats);
  });

  constructor(private monthYear: MonthYearPipe) {
  }

  ngOnInit(): void {
  }

  private render(stats: CouncilStatsResponseDTO[]) {
    let allProjectsAccepted = stats
      .map(s => s.projectsAccepted)
      .reduce((prev, curr) => prev + curr, 0);
    let allProjectsRejected = stats
      .map(s => s.projectsRejected)
      .reduce((prev, curr) => prev + curr, 0);
    let allProjectsReturned = stats
      .map(s => s.projectsReturned)
      .reduce((prev, curr) => prev + curr, 0);
    let allProjectsReturnedWithoutExpertise = stats
      .map(s => s.projectsReturnedWithoutExpertise)
      .reduce((prev, curr) => prev + curr, 0);
    this.chart = Chart.chart('Результаты по объектам экспертизы в ГЭС по месяцам')
      .xAxis(Chart.axis().categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis('Количество')
        .allowDecimals(false))
      .exporting(Chart.exporting()
        .filename('Результаты по объектам экспертизы')
        .size(625, 350))
      .plotOptions(Chart.columnOptions()
        .dataLabels(Chart.dataLabels()
          .enabled(true)))
      .series(Chart.columnOptions(`Рекомендованные: ${allProjectsAccepted}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Рекомендованные: {point.y}`))
        .color(acceptedClr)
        .data(stats.map(stats => stats.projectsAccepted)))
      .series(Chart.columnOptions(`Не рекомендованные: ${allProjectsRejected}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Не рекомендованные: {point.y}`))
        .color(rejectedClr)
        .data(stats.map(stats => stats.projectsRejected)))
      .series(Chart.columnOptions(`Возвращённые: ${allProjectsReturned}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Возвращённые: {point.y}`))
        .color(returnedClr)
        .data(stats.map(stats => stats.projectsReturned)))
      .series(Chart.columnOptions(`Отклонены без проведения экспертизы: ${allProjectsReturnedWithoutExpertise}`)
        .tooltip(Chart.tooltip()
          .pointFormat(`<span style="color:{point.color}">\u25CF</span> Отклонены без проведения экспертизы: {point.y}`))
        .color(returnedWithoutExpertiseClr)
        .data(stats.map(stats => stats.projectsReturnedWithoutExpertise)));
  }
}
