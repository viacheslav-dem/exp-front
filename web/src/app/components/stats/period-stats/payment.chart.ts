/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {StatsDto} from "@app/dto/StatsDto";
import {blue05Clr, blueClr} from "@app/components/stats/colors";
import {NumberPipe} from "@app/pipes/number.pipe";

@Component({
    selector: 'app-payment-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class PaymentChart implements OnInit {

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
    this.chart = Chart.chart('Оплата')
      .xAxis(Chart.axis().categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
      .yAxis(Chart.axis()
        .title(Chart.title('Сумма, BYN')))
      .yAxis(Chart.axis()
        .opposite()
        .allowDecimals(false)
        .title(Chart.title('Количество оплат')))
      .exporting(Chart.exporting()
        .filename('Оплата')
        .size(625, 350))
      .tooltip(Chart.tooltip().shared())
      .series(Chart.columnOptions('Оплаченная сумма')
        .data(stats.map(stats => stats.paidSum))
        .color(blue05Clr)
        .dataLabels(Chart.dataLabels()
          .formatter(function () {
            return numberFormat.transform(this.y, 2) + ' BYN';
          })
          .enabled(true))
        .tooltip(Chart.tooltip()
          .valueFormatter(Chart.valueFormat()
            .precision(2)
            .suffix('BYN'))))
      .series(Chart.lineOptions('Количество проведённых оплат')
        .data(stats.map(stats => stats.paid))
        .yAxis(1)
        .color(blueClr));
  }
}
