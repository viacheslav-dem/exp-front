import {Component} from '@angular/core';
import {Catalog} from "app/services/data.service";

@Component({
  selector: 'app-areas-of-competence',
  template: `<app-simple-catalog
        header="Справочник областей компетенции"
        addLabel="Добавить область компетенции"
        itemLabel="область компетенции"
        noItemsLabel="Области компетенции отсутствуют"
        [type]="Catalog.AREA_OF_COMPETENCE"
    ></app-simple-catalog>`,
})
export class AreasOfCompetenceComponent {
  Catalog = Catalog;
}

