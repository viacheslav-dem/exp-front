import {Component} from '@angular/core';
import {Catalog} from "app/services/data.service";

@Component({
  selector: 'app-directions',
  template: `
    <app-simple-catalog
      header="Справочник приоритетных направлений научных исследований и (или) научно-технической деятельности"
      addLabel="Добавить приоритетное направление научных исследований и (или) научно-технической деятельности"
      itemLabel="приоритетное направление научных исследований и (или) научно-технической деятельности"
      noItemsLabel="Приоритетные направления научных исследований и (или) научно-технической деятельности отсутствуют"
      [type]="Catalog.DIRECTION"
    ></app-simple-catalog>
  `,
})
export class DirectionsComponent {
  Catalog = Catalog;
}

