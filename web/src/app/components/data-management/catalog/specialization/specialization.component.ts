import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-specialization',
    template: `<app-simple-catalog
        [header]="'Справочник специализаций'"
        [addLabel]="'Добавить специализацию'"
        [itemLabel]="'специализация'"
        [noItemsLabel]="'Специализации отсутствуют'"
        [type]="Catalog.SPECIALIZATION"
    ></app-simple-catalog>`,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class SpecializationComponent {
  Catalog = Catalog;
}
