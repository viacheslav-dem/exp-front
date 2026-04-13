import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-effect-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        @if (num()) {
          <span>{{num()}}.</span>
        }
        Соответствие экономического и (или) социального эффекта установленным условиям коммерциализации:
      </label>
      <app-boolean-button name="effectAccordance" required [ngModel]="_form()?.effectAccordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ effectAccordance: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.effectAccordanceText"
          (ngModelChange)="emitPatch({ effectAccordanceText: $event })"
          [attr.name]="'effectAccordanceText_' + (num() ? num().split('.').join('_') : 'effect')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Если при оценке результатов НТД выявлены несоответствия, то сделайте вывод о несоответствии.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class EffectAccordanceBlockComponent {

  readonly num = input<string>(undefined);

  readonly full = input<boolean>(true);

  readonly _form = input<EffectAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<EffectAccordanceBlockForm>>();

  emitPatch(patch: Partial<EffectAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type EffectAccordanceBlockForm = {
  effectAccordance: boolean;
  effectAccordanceText: string;
};
