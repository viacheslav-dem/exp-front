import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-patents-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта экспертизы критерию, указанному в абзаце 2 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (использование способных к правовой охране результатов интеллектуальной деятельности):
      </label>
      <input type="hidden" [ngModel]="_form()?.patents" name="patents" required>
      <app-boolean-button
        name="patents"
        required
        [ngModel]="_form()?.patents"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ patents: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.patentsText" (ngModelChange)="emitPatch({ patentsText: $event })" name="patentsText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class PatentsAccordanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<PatentsAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<PatentsAccordanceBlockForm>>();

  emitPatch(patch: Partial<PatentsAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type PatentsAccordanceBlockForm = {
  patents: boolean;
  patentsText: string;
};
