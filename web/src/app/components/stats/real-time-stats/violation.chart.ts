/**
 * Created by belous.dmitri on 08.02.2017.
 */

import {TermsViolationDto} from "app/dto/ViolationDto";
import {Component, EventEmitter, Input, OnInit, Output, input} from "@angular/core";
import {Chart} from "app/components/highchart/highchart.builder";
import {MonthYearPipe} from "app/pipes/mdate.pipe";
import {blueClr, noViolationClr, redClr, yellowClr} from "@app/components/stats/colors";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import dayjs from 'dayjs';

@Component({
    selector: 'app-violation-chart',
    template: '<highchart [options]="chart"></highchart>',
    standalone: false
})
export class ViolationChart implements OnInit {

  chart: any = Chart.chart().loading().options;
  readonly title = input<string>('Отслеживание сроков');
  readonly date = input<number>(new Date().getTime());
  readonly filterKeyPrefix = input<string>('');
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(private monthYear: MonthYearPipe) {
  }

  ngOnInit(): void {
  }

  @Input() set violation(violation: TermsViolationDto) {
    if (!violation) {
      return;
    }
    this.chart = Chart.chart(this.title())
      .size(300, 300)
      .exporting(Chart.exporting()
        .filename('Отслеживание сроков (' + this.title() + ' на ' + this.monthYear.transform(this.date()) + ")")
        .size(400, 400)
        .chartOptions(Chart.chart('Отслеживание сроков (' + this.title() + ')')
          .plotOptions(Chart.pieOptions()
            .dataLabels(Chart.dataLabels().format("{point.name}: {y}")))))
      .tooltip(Chart.tooltip()
        .headerFormatSeriesNameAndPointKey()
        .pointFormat(`<span style="color:{point.color}">\u25CF</span> Количество: <b>{point.y}</b>`))
      .plotOptions(Chart.pieOptions()
        .dataLabels(Chart.dataLabels().format("{y}")))
      .series(Chart.pieOptions(this.title())
        .cursorPointer()
        .data(this.violationAsSeries(violation)));
  }

  violationAsSeries(violation: TermsViolationDto) {
    return [{
      name: 'Срок нарушен',
      y: violation.red,
      color: redClr,
      events: {
        click: () => {
          this.onClick.emit({
            filterName: 'нарушены сроки',
            filter: FilterBuilder.dateRange(this.filterKeyPrefix() + 'stateEndDate',
              null, dayjs().subtract(1, 'day').valueOf())
          });
          return false;
        },
      },
    }, {
      name: 'Последний день',
      y: violation.yellow,
      color: yellowClr,
      events: {
        click: () => {
          this.onClick.emit({
            filterName: 'последний день срока',
            filter: FilterBuilder.dateRange(this.filterKeyPrefix() + 'stateEndDate',
              dayjs().subtract(1, 'day').valueOf(), dayjs().valueOf())
          });
          return false;
        },
      },
    }, {
      name: 'Прошла половина срока',
      y: violation.blue,
      color: blueClr,
      events: {
        click: () => {
          this.onClick.emit({
            filterName: 'прошла половина срока',
            filter: FilterBuilder.and('', [
              FilterBuilder.dateRange(this.filterKeyPrefix() + 'stateEndDate', dayjs().valueOf(), null),
              FilterBuilder.dateRange(this.filterKeyPrefix() + 'stateMiddleDate', null, dayjs().valueOf()),
            ])
          });
          return false;
        },
      },
    }, {
      name: 'Менее половины срока',
      y: violation.noViolation,
      color: noViolationClr,
      events: {
        click: () => {
          this.onClick.emit({
            filterName: 'прошло менее половины срока',
            filter: FilterBuilder.dateRange(this.filterKeyPrefix() + 'stateMiddleDate', dayjs().valueOf(), null)
          });
          return false;
        },
      },
    }].filter(value => (value.y != 0));
  }
}
