import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-areas-of-competence',
    template: `<app-simple-catalog
        [header]="'Справочник областей компетенции'"
        [addLabel]="'Добавить область компетенции'"
        [itemLabel]="'область компетенции'"
        [noItemsLabel]="'Области компетенции отсутствуют'"
        [type]="Catalog.AREA_OF_COMPETENCE"
    ></app-simple-catalog>`,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class AreasOfCompetenceComponent {
  Catalog = Catalog;
}

