import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-advantage-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта экспертизы критерию, указанному в абзаце 3 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (обладание товаром более высокими технико-экономическими показателями по сравнению с
        другими товарами, представленными на определенном сегменте рынка):
      </label>
      <app-boolean-button
        name="advantage"
        required
        [(ngModel)]="_form().advantage"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().advantageText" name="advantageText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class AdvantageAccordanceBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    advantage: boolean;
    advantageText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
