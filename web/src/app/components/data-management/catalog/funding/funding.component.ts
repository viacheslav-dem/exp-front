import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-funding',
    template: `<app-simple-catalog
      [header]="'Справочник источников финансирования'"
      [addLabel]="'Добавить источник финансирования'"
      [itemLabel]="'источник финансирования'"
      [noItemsLabel]="'Источники финансирования отсутствуют'"
      [type]="Catalog.FUNDING"
    ></app-simple-catalog>`,
    styles: [],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class FundingComponent {
  Catalog = Catalog;
}
