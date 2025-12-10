import {Component} from "@angular/core";
import {Catalog} from "app/services/data.service";

@Component({
    selector: 'app-commercialization-methods',
    template: `<app-simple-catalog
        [header]="'Справочник способов коммерциализации'"
        [addLabel]="'Добавить способ коммерциализации'"
        [itemLabel]="'способ коммерциализации'"
        [noItemsLabel]="'Способы коммерциализации отсутствуют'"
        [type]="Catalog.COMMERCIALIZATION_METHODS"
    ></app-simple-catalog>`,
    standalone: false
})
export class CommercializationMethodsComponent {
    Catalog = Catalog;
}