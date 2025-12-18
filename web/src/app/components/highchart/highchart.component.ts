import {timer as observableTimer} from 'rxjs';
import {Component, ElementRef, Input, ChangeDetectionStrategy} from "@angular/core";
import {Chart, ChartBuilder} from "./highchart.builder";
import {environment} from "../../../environments/environment";

/**
 * Created by belous.dmitri on 28.10.2016.
 */

declare let Highcharts: any;
export let defaultChartHeight = 300;

Highcharts.setOptions(Chart.chart()
  .backgroundColor()
  .skipClone()
  .style({overflow: 'visible'})
  .height(defaultChartHeight)
  .spacing([20, 0, 15, 0])
  .title(Chart.title().margin(10).style({fontSize:'14px'}))
  .exporting(false)
  .credits(false)
  .xAxis(Chart.axis()
    .crosshair()
    .lineWidth(1), true)
  .yAxis(Chart.axis().lineWidth(1), true)
  .loading(Chart.loading().style({
    fontWeight: 'bold',
    'background-color': 'rgba(0,0,0,0)'
  }))
  .legend(Chart.legend().margin(5))
  .plotOptions(Chart.pieOptions()
    .allowPointSelect()
    .innerSize('70%')
    .dataLabels(Chart.dataLabels()
      .padding(0)
      .y(-4)
      .format('{point.name}<br>{point.percentage:.1f} %')
      .style({
        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
      })
      .distance(10))
  )
  .plotOptions(Chart.barOptions()
    .dataLabels(Chart.dataLabels()
      .enabled()
      .allowOverlap()
      .y(1)))
  .plotOptions(Chart.columnOptions()
    .dataLabels(Chart.dataLabels()
      .allowOverlap()
      .y(1)))
  .plotOptions(Chart.areaOptions()
    .fillOpacity(0.5)
    .marker(Chart.marker().radius(3)))
  .plotOptions(Chart.lineOptions()
    .marker(Chart.marker().radius(3)))
  .lang({
    contextButtonTitle: "Контекстное меню",
    downloadJPEG: "Скачать как JPEG изображение",
    downloadPDF: "Скачать как PDF документ",
    downloadPNG: "Скачать как PNG изображение",
    downloadSVG: "Скачать как SVG изображение",
    drillUpText: "Назад к {series.name}",
    loading: '<img src="assets/loading_32.gif">',
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    noData: "Нет данных",
    numericSymbols: [" тыс", " млн", " млрд", " трлн", " квадрлн", " квинтлн"],
    printChart: "Печать графика",
    resetZoom: "Уменьшить увеличение",
    resetZoomTitle: "Сбросить увеличение",
    shortMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    shortWeekdays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
    thousandsSep: " ",
    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  })
  .options
);

Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
  proceed.call(this);
  this.container.style.overflow = 'visible';
});

@Component({
    selector: "highchart",
    template: '<div (mouseleave)="onMouseLeave()" (mouseenter)="onMouseEnter()"></div>',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class HighchartComponent {

  chart: any;
  hover = false;

  constructor(private el: ElementRef
              // private logger: Logger
  ) {
  }

  onMouseEnter() {
    this.hover = true;
    // this.showExportButton(); // not working now, need to repair
  }

  onMouseLeave() {
    this.hover = false;
    observableTimer(800).subscribe(() => {
      this.hideExportButton();
    });
  }

  showExportButton() {
    const button: HTMLElement | null = this.el.nativeElement.querySelector('.highcharts-contextbutton');
    if (button) {
      button.removeAttribute('hidden');
    }
  }

  hideExportButton() {
    if (!this.hover) {
      const button: HTMLElement | null = this.el.nativeElement.querySelector('.highcharts-contextbutton');
      if (button) {
        button.setAttribute('hidden', 'true');
      }
    }
  }

  @Input() set options(options: any) {
    try {
      if (options instanceof ChartBuilder) {
        options = options.options;
      }
      this.chart = Highcharts.chart(this.el.nativeElement.children[0], options);
      if (options.loading && options.loading.enabled) {
        this.chart.showLoading();
      }
      this.hideExportButton();
    } catch (e) {
      console.error(e);
    }
  }
}
