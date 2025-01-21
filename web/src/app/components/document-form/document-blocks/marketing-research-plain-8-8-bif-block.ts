import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-marketing-research-8-8-plain-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Проведение маркетинговых и патентных исследований, их результаты:
      </label>
      <app-dropdown [options]="marketingResearchOptions" [(ngModel)]="_form.marketingResearch"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
    </div>
  `
})
export class MarketingResearchPlainBifBlockComponent {

  marketingResearchOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  @Input()
  num: string = "5";

  @Input()
  full: boolean = true;

  @Input()
  _form: { marketingResearch: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
