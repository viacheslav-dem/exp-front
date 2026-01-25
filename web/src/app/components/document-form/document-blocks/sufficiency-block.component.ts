import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-sufficiency-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность запланированных этапов работ (услуг),
        создаваемого и приобретаемого программного обеспечения,
        технических средств и (или) комплексов программно-технических средств для достижения
        целей государственной программы информатизации (подпрограммы),
        либо других программ в части мероприятий в сфере информатизации,
        либо перечня научных исследований и разработок по развитию государственной системы научно-технической
        информации Республики Беларусь:
      </label>
      <input type="hidden" [ngModel]="_form()?.sufficiency" name="sufficiency" required>
      <app-boolean-button name="sufficiency" required [ngModel]="_form()?.sufficiency" [trueLabel]="'достаточно'"
        [falseLabel]="'недостаточно'"
      (ngModelChange)="emitPatch({ sufficiency: $event })"></app-boolean-button>
      @if (!_form()?.sufficiency) {
        <label>Рекомендуется добавить:</label>
        <textarea
          [ngModel]="_form()?.sufficiencySuggestion" (ngModelChange)="emitPatch({ sufficiencySuggestion: $event })" name="sufficiencySuggestion" required maxlength="5000" rows="2" class="form-control"
          title="Рекомендуется добавить"
          placeholder="перечисление ресурсов, которые необходимо добавить в процессе реализации объекта экспертизы"
        ></textarea>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form()?.sufficiencyText"
          (ngModelChange)="emitPatch({ sufficiencyText: $event })"
          [attr.name]="'sufficiencyText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class SufficiencyBlockComponent {

  readonly num = input<string>("4");

  readonly full = input<boolean>(true);

  readonly _form = input<SufficiencyBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<SufficiencyBlockForm>>();

  emitPatch(patch: Partial<SufficiencyBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type SufficiencyBlockForm = {
  sufficiency: boolean;
  sufficiencyText: string;
  sufficiencySuggestion: string;
};
