import {Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";

@Component({
  selector: 'app-funding',
  template: `<app-simple-catalog
      header="Справочник источников финансирования"
      addLabel="Добавить источник финансирования"
      itemLabel="источник финансирования"
      noItemsLabel="Источники финансирования отсутствуют"
      [type]="Catalog.FUNDING"
    ></app-simple-catalog>`,
  styles: []
})
export class FundingComponent {
  Catalog = Catalog;
}
