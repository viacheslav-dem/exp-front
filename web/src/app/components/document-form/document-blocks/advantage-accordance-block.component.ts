import {Component, input, output} from '@angular/core';

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
      <input type="hidden" [ngModel]="_form()?.advantage" name="advantage" required>
      <app-boolean-button
        name="advantage"
        required
        [ngModel]="_form()?.advantage"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ advantage: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.advantageText" (ngModelChange)="emitPatch({ advantageText: $event })" name="advantageText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class AdvantageAccordanceBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<AdvantageAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AdvantageAccordanceBlockForm>>();

  emitPatch(patch: Partial<AdvantageAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type AdvantageAccordanceBlockForm = {
  advantage: boolean;
  advantageText: string;
};
