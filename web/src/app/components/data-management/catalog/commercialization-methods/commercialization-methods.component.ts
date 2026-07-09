import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Catalog} from "app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-commercialization-methods',
    template: `<app-simple-catalog
        [header]="'Справочник способов коммерциализации'"
        [addLabel]="'Добавить способ коммерциализации'"
        [itemLabel]="'способ коммерциализации'"
        [noItemsLabel]="'Способы коммерциализации отсутствуют'"
        [type]="Catalog.COMMERCIALIZATION_METHODS"
    ></app-simple-catalog>`,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class CommercializationMethodsComponent {
    Catalog = Catalog;
}