import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-technology-type-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Использование технологий V или VI технологических укладов:
      </label>
      <input type="hidden" [ngModel]="_form()?.technologyType5" name="technologyType5" required>
      <div>
        <span>V технологический уклад: </span>
        <app-boolean-button class="d-inline-block"
          name="technologyType5"
          required
          [ngModel]="_form()?.technologyType5"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="emitPatch({ technologyType5: $event })"></app-boolean-button>
      </div>
      <input type="hidden" [ngModel]="_form()?.technologyType6" name="technologyType6" required>
      <div>
        <span>VI технологический уклад: </span>
        <app-boolean-button class="d-inline-block"
          name="technologyType6"
          required
          [ngModel]="_form()?.technologyType6"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="emitPatch({ technologyType6: $event })"></app-boolean-button>
      </div>
      <input type="hidden" [ngModel]="_form()?.technologyOtherType" name="technologyOtherType" required>
      <div>
        <span>проект другого технологического уклада: </span>
        <app-boolean-button class="d-inline-block"
          name="technologyOtherType"
          required
          [ngModel]="_form()?.technologyOtherType"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="emitPatch({ technologyOtherType: $event })"></app-boolean-button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.technologyTypeText"
          (ngModelChange)="emitPatch({ technologyTypeText: $event })"
          [attr.name]="'technologyTypeText_' + num().split('.').join('_')"
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
export class TechnologyTypeBlockComponent {

  readonly num = input<string>("1.3");

  readonly full = input<boolean>(true);

  readonly _form = input<TechnologyTypeBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<TechnologyTypeBlockForm>>();

  emitPatch(patch: Partial<TechnologyTypeBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type TechnologyTypeBlockForm = {
  technologyType5: boolean;
  technologyType6: boolean;
  technologyOtherType: boolean;
  technologyTypeText: string;
};
