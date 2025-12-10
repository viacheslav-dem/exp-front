/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {StatsDto} from "@app/dto/StatsDto";
import {blueClr, red05Clr, redClr} from "@app/components/stats/colors";
import {NumberPipe} from "@app/pipes/number.pipe";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";

@Component({
    selector: 'app-councils-examination-violation-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class CouncilsExaminationViolationChart implements OnInit {

  chart: any = Chart.chart().loading().options;

  constructor(private monthYear: MonthYearPipe,
              private numberPipe: NumberPipe) {
  }

  ngOnInit(): void {
  }

  @Input() set stats(stats: StatsDto[]) {
    if (!stats) {
      return;
    }
    let numberFormat = this.numberPipe;
    this.chart = Chart.chart('Контроль времени экспертизы в ГЭС')
      .xAxis(Chart.axis().categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis()
        .title(Chart.title('Процент нарушений, %').color(redClr))
        .labels(Chart.labels().color(redClr)))
      .yAxis(Chart.axis()
        .opposite()
        .min(0)
        .title(Chart.title('Среднее время, сут').color(blueClr))
        .labels(Chart.labels().color(blueClr)))
      .exporting(Chart.exporting()
        .filename('Контроль времени экспертизы в ГЭС')
        .size(625, 350))
      .tooltip(Chart.tooltip().shared())
      .series(Chart.columnOptions('Процент нарушений сроков')
        .data(stats.map(stats => {
          return {
            y: TermsStatsDto.violationsPercent(stats.councilsExaminationTermsStats),
            all: stats.councilsExaminationTermsStats.totalCount,
            count: stats.councilsExaminationTermsStats.violations,
          }
        }))
        .dataLabels(Chart.dataLabels()
          .formatter(function () {
            return numberFormat.transform(this.y, 2) + ' %';
          })
          .enabled(true))
        .tooltip(Chart.tooltip()
          .pointFormatter(function () {
            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: ` +
              `<b>${numberFormat.transform(this.y, 2)}</b> %<br/>` +
              `<span style="color:${this.color}">\u25CF</span> Количество нарушений: <b>${this.count}</b><br/>` +
              `<span style="color:${blueClr}">\u25CF</span> Рассмотрено объектов экспертизы: <b>${this.all}</b><br/>`;
          }))
        .color(red05Clr))
      .series(Chart.lineOptions('Среднее время экспертизы')
        .data(stats.map(stats => stats.councilsExaminationTermsStats.averageTime))
        .color(blueClr)
        .yAxis(1)
        .tooltip(Chart.tooltip()
          .valueFormatter(Chart.valueFormat()
            .precision(2)
            .suffix('сут'))));
  }
}
