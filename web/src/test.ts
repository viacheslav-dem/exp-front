// src/test.ts (для Angular 7-10)
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Мокаем Highcharts глобально для всех тестов
(window as any).Highcharts = {
  chart: function() {
    return {
      destroy: () => {},
      reflow: () => {},
      update: () => {},
      series: [],
      xAxis: [{ setExtremes: () => {} }],
      yAxis: [{ setExtremes: () => {} }]
    };
  },
  setOptions: () => {},
  getOptions: () => ({}),
  dateFormat: () => '',
  numberFormat: () => '',
  format: () => '',
  color: () => ({}),
  // Добавляем метод wrap для совместимости с highchart.component.ts
  wrap: function(obj: any, method: string, func: Function) {
    const original = obj[method];
    obj[method] = function() {
      return func.call(this, original, ...arguments);
    };
  },
  // Добавляем prototype для совместимости
  Chart: function() {
    return {
      destroy: () => {},
      reflow: () => {},
      update: () => {},
      series: [],
      xAxis: [{ setExtremes: () => {} }],
      yAxis: [{ setExtremes: () => {} }]
    };
  }
};
// Устанавливаем prototype для Chart
if ((window as any).Highcharts.Chart) {
  (window as any).Highcharts.Chart.prototype = {
    destroy: () => {},
    reflow: () => {},
    update: () => {},
    series: [],
    xAxis: [{ setExtremes: () => {} }],
    yAxis: [{ setExtremes: () => {} }]
  };
}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);
