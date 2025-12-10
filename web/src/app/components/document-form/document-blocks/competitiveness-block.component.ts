import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-competitiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Обоснование конкурентоспособности разработки:
      </label>
      <app-dropdown [options]="competitivenessOptions" [(ngModel)]="_form().competitiveness"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().competitivenessText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class CompetitivenessBlockComponent {

  competitivenessOptions: string[] = [
    'достаточно',
    'недостаточно',
  ];

  readonly num = input<string>("5.1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    competitiveness: string;
    competitivenessText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
