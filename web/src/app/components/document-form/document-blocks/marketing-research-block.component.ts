import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-marketing-research-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Проведение маркетинговых и патентных исследований, их результаты:
      </label>
      <app-dropdown [options]="marketingResearchOptions" [(ngModel)]="_form.marketingResearch"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.marketingResearchText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите результаты проведения маркетинговых и патентных исследований по объекту государственной
          экспертизы. 
          При необходимости проведения маркетинговых и патентных исследований и их отсутствии в заявочных документах
          объекта государственной экспертизы, укажите в замечаниях на необходимость их проведения.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `
})
export class MarketingResearchBlockComponent {

  marketingResearchOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  @Input()
  num: string = "5";

  @Input()
  full: boolean = true;

  @Input()
  _form: { marketingResearch: string, marketingResearchText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
