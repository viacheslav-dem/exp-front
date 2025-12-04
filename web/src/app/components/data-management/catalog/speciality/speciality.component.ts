import {Component} from '@angular/core';
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-speciality',
    template: `<app-simple-catalog
        [header]="'Справочник специальностей'"
        [addLabel]="'Добавить специальность'"
        [itemLabel]="'специальность'"
        [noItemsLabel]="'Специальности отсутствуют'"
        [type]="Catalog.SPECIALITY"
    ></app-simple-catalog>`,
    standalone: false
})
export class SpecialityComponent {
  Catalog = Catalog;
}
