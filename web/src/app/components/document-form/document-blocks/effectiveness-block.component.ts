import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-effectiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка результатов научной и (или) научно-технической и (или) инновационной деятельности в
        соответствии с методическими рекомендациями по оценке эффективности научных, научно-технических и инновационных
        разработок и их внедрения, утвержденными постановлением Государственного комитета по науке и технологиям
        Республики Беларусь от 20 апреля 2017 г. № 9.
      </label>
      <textarea
        [ngModel]="_form()?.effectiveness"
        (ngModelChange)="emitPatch({ effectiveness: $event })"
        [attr.name]="'effectiveness_' + num().split('.').join('_')"
        required
        minlength="30"
        rows="3"
        class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
    </div>
  `,
    standalone: false
})
export class EffectivenessBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<EffectivenessBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<EffectivenessBlockForm>>();

  emitPatch(patch: Partial<EffectivenessBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type EffectivenessBlockForm = {
  effectiveness: string;
};
