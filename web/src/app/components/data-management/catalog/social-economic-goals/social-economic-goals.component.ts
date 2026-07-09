import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog} from "app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-social-economic-goals',
    template: `
    <app-simple-catalog
      [header]="'Справочник целей (приоритетов) социально-экономического развития'"
      [addLabel]="'Добавить цель (приоритет) социально-экономического развития'"
      [itemLabel]="'цель (приоритет) социально-экономического развития'"
      [noItemsLabel]="'Цели (приоритеты) социально-экономического развития отсутствуют'"
      [type]="Catalog.SOCIAL_ECONOMIC_GOAL"
    ></app-simple-catalog>
  `,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class SocialEconomicGoalsComponent {
  Catalog = Catalog;
}

