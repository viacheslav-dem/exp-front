import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-industrial-property',
    template: `<app-simple-catalog
        [header]="'Справочник объектов права промышленной собственности'"
        [addLabel]="'Добавить объекты права промышленной собственности'"
        [itemLabel]="'объект права промышленной собственности'"
        [noItemsLabel]="'Объекты права промышленной собственности отсутствуют'"
        [type]="Catalog.INDUSTRIAL_PROPERTY"
    ></app-simple-catalog>`,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class IndustrialPropertyComponent {
  Catalog = Catalog;
}
