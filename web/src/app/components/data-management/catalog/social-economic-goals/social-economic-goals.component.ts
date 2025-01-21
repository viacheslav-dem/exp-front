import {Component} from '@angular/core';
import {Catalog} from "app/services/data.service";

@Component({
  selector: 'app-social-economic-goals',
  template: `
    <app-simple-catalog
      header="Справочник целей (приоритетов) социально-экономического развития"
      addLabel="Добавить цель (приоритет) социально-экономического развития"
      itemLabel="цель (приоритет) социально-экономического развития"
      noItemsLabel="Цели (приоритеты) социально-экономического развития отсутствуют"
      [type]="Catalog.SOCIAL_ECONOMIC_GOAL"
    ></app-simple-catalog>
  `,
})
export class SocialEconomicGoalsComponent {
  Catalog = Catalog;
}

