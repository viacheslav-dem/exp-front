import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-marketing-research-8-8-plain-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Проведение маркетинговых и патентных исследований, их результаты:
      </label>
      <app-dropdown [options]="marketingResearchOptions" [(ngModel)]="_form().marketingResearch"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
    </div>
  `,
    standalone: false
})
export class MarketingResearchPlainBifBlockComponent {

  marketingResearchOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  readonly num = input<string>("5");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    marketingResearch: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
