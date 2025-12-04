import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-competitiveness-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта экспертизы критерию, указанному в абзаце 3 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (конкурентоспособность товара):
      </label>
      <app-boolean-button
        [(ngModel)]="_form().competitiveness"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().competitivenessText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class CompetitivenessAccordanceBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    competitiveness: boolean;
    competitivenessText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
