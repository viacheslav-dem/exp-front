import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-competitiveness-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта экспертизы критерию, указанному в абзаце 3 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (конкурентоспособность товара):
      </label>
      <input type="hidden" [ngModel]="_form()?.competitiveness" name="competitiveness" required>
      <app-boolean-button
        name="competitiveness"
        required
        [ngModel]="_form()?.competitiveness"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ competitiveness: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.competitivenessText" (ngModelChange)="emitPatch({ competitivenessText: $event })" name="competitivenessText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class CompetitivenessAccordanceBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<CompetitivenessAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<CompetitivenessAccordanceBlockForm>>();

  emitPatch(patch: Partial<CompetitivenessAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type CompetitivenessAccordanceBlockForm = {
  competitiveness: boolean;
  competitivenessText: string;
};
