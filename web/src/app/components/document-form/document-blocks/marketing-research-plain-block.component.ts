import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-marketing-research-plain-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Проведение маркетинговых и патентных исследований, их результаты:
      </label>
      <app-dropdown [options]="marketingResearchOptions" [(ngModel)]="_form().marketingResearch"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите результаты проведения маркетинговых и патентных исследований по объекту государственной
            экспертизы. При необходимости проведения маркетинговых и патентных исследований и их отсутствии в заявочных документах
            объекта государственной экспертизы, укажите в замечаниях на необходимость их проведения.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class MarketingResearchPlainBlockComponent {

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
