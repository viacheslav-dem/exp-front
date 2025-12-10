import {Component} from '@angular/core';
import {Catalog} from "app/services/data.service";

@Component({
    selector: 'app-currency',
    template: `<app-simple-catalog
        [header]="'Справочник валют'"
        [addLabel]="'Добавить валюту'"
        [itemLabel]="'валюта'"
        [noItemsLabel]="'Валюты отсутствуют'"
        [type]="Catalog.CURRENCY"
    ></app-simple-catalog>`,
    standalone: false
})
export class CurrencyComponent {
  Catalog = Catalog;
}
