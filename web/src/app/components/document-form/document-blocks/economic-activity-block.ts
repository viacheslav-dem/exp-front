import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-economic-activity-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие товара перечню кодов продукции по видам экономической деятельности согласно приложению к Положению:
      </label>
      <input type="hidden" [ngModel]="_form()?.economicActivity" name="economicActivity" required>
      <app-boolean-button [ngModel]="_form()?.economicActivity" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ economicActivity: $event })"></app-boolean-button>
      @if (full() || _form()?.economicActivity) {
        <textarea
          [ngModel]="_form()?.economicActivityText"
          (ngModelChange)="emitPatch({ economicActivityText: $event })"
          [attr.name]="'economicActivityText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class EconomicActivityBlockComponent {

    readonly num = input<string>("9.1");

    readonly full = input<boolean>(true);
    readonly _form = input<EconomicActivityBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<EconomicActivityBlockForm>>();

    emitPatch(patch: Partial<EconomicActivityBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type EconomicActivityBlockForm = {
  economicActivity: boolean;
  economicActivityText: string;
};
