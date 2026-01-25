import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-effect-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия:
      </label>
      <input type="hidden" [ngModel]="_form()?.effect" name="effect" required>
      <app-boolean-button
        name="effect"
        required
        [ngModel]="_form()?.effect"
        [trueLabel]="'присутствует'"
        [falseLabel]="'отсутствует'"
        (ngModelChange)="emitPatch({ effect: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.effectText" (ngModelChange)="emitPatch({ effectText: $event })" name="effectText" required minlength="30" maxlength="5000" rows="3" class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class EffectConclusionBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<EffectConclusionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<EffectConclusionBlockForm>>();

  emitPatch(patch: Partial<EffectConclusionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type EffectConclusionBlockForm = {
  effect: boolean;
  effectText: string;
};
