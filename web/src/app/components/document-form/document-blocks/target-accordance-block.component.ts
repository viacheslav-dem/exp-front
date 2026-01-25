import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-target-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
      </label>
      <input type="hidden" [ngModel]="_form()?.targetAccordance" name="targetAccordance" required>
      <app-boolean-button name="targetAccordance" required [ngModel]="_form()?.targetAccordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ targetAccordance: $event })"></app-boolean-button>
      @if (!_form()?.targetAccordance) {
        <label>Рекомендуемые цели:</label>
        <textarea [ngModel]="_form()?.targetSuggestion" (ngModelChange)="emitPatch({ targetSuggestion: $event })" name="targetSuggestion" required maxlength="5000" rows="2" class="form-control"
          title="Рекомендуемые цели"
        placeholder="Рекомендуемые цели"></textarea>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form()?.targetAccordanceText"
          (ngModelChange)="emitPatch({ targetAccordanceText: $event })"
          [attr.name]="'targetAccordanceText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TargetAccordanceBlockComponent {

  readonly num = input<string>("9.5");

  readonly full = input<boolean>(true);

  readonly _form = input<TargetAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<TargetAccordanceBlockForm>>();

  emitPatch(patch: Partial<TargetAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type TargetAccordanceBlockForm = {
  targetAccordance: boolean;
  targetSuggestion: string;
  targetAccordanceText: string;
};
