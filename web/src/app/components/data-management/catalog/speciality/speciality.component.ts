import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-speciality',
    template: `<app-simple-catalog
        [header]="'Справочник специальностей'"
        [addLabel]="'Добавить специальность'"
        [itemLabel]="'специальность'"
        [noItemsLabel]="'Специальности отсутствуют'"
        [type]="Catalog.SPECIALITY"
    ></app-simple-catalog>`,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class SpecialityComponent {
  Catalog = Catalog;
}
