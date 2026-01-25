import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-high-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможность отнесения товаров (работ, услуг) к категории высокотехнологичных: <br>
        (отнесение товаров (работ, услуг) к высокотехнологичным возможно,
        если в подпункте 5.6 пункта 5 настоящего заключения значение коэффициента технологичности товара (работы, услуги) получено на уровне не менее 50 баллов).
      </label>
      <input type="hidden" [ngModel]="_form()?.highTech" name="highTech" required>
      <app-boolean-button
        name="highTech"
        required
        [ngModel]="_form()?.highTech"
        [trueLabel]="'возможно'"
        [falseLabel]="'невозможно'"
      (ngModelChange)="emitPatch({ highTech: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.highTechText" (ngModelChange)="emitPatch({ highTechText: $event })" name="highTechText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class HighTechBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<HighTechBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<HighTechBlockForm>>();

  emitPatch(patch: Partial<HighTechBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type HighTechBlockForm = {
  highTech: boolean;
  highTechText: string;
};
