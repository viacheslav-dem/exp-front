import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-marketing-research-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Проведение маркетинговых и патентных исследований, их результаты:
      </label>
      <app-dropdown
        [options]="marketingResearchOptions"
        [(ngModel)]="_form().marketingResearch"
        [attr.name]="'marketingResearch_' + num().split('.').join('_')"
        required
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().marketingResearchText"
          [attr.name]="'marketingResearchText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full()) {
        <div class="hint">
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
      }
    </div>
    `,
    standalone: false
})
export class MarketingResearchBlockComponent {

  marketingResearchOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  readonly num = input<string>("5");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    marketingResearch: string;
    marketingResearchText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
