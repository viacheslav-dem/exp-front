import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-currency',
    template: `<app-simple-catalog
        [header]="'Справочник валют'"
        [addLabel]="'Добавить валюту'"
        [itemLabel]="'валюта'"
        [noItemsLabel]="'Валюты отсутствуют'"
        [type]="Catalog.CURRENCY"
    ></app-simple-catalog>`,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class CurrencyComponent {
  Catalog = Catalog;
}
