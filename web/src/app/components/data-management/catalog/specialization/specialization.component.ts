import {Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-specialization',
    template: `<app-simple-catalog
        [header]="'Справочник специализаций'"
        [addLabel]="'Добавить специализацию'"
        [itemLabel]="'специализация'"
        [noItemsLabel]="'Специализации отсутствуют'"
        [type]="Catalog.SPECIALIZATION"
    ></app-simple-catalog>`,
    standalone: false
})
export class SpecializationComponent {
  Catalog = Catalog;
}
