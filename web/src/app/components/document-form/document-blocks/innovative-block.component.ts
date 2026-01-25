import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-innovative-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможность отнесения товаров (работ, услуг) к категории инновационных:
      </label>
      <input type="hidden" [ngModel]="_form()?.innovative" name="innovative" required>
      <app-boolean-button
        name="innovative"
        required
        [ngModel]="_form()?.innovative"
        [trueLabel]="'возможно'"
        [falseLabel]="'невозможно'"
      (ngModelChange)="emitPatch({ innovative: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.innovativeText" (ngModelChange)="emitPatch({ innovativeText: $event })" name="innovativeText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class InnovativeBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<InnovativeBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<InnovativeBlockForm>>();

  emitPatch(patch: Partial<InnovativeBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type InnovativeBlockForm = {
  innovative: boolean;
  innovativeText: string;
};
