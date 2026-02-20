import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-characteristics-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Функциональные, технические, технологические и другие характеристики создаваемых и приобретаемых
        программного обеспечения, технических средств и (или) комплексов программно-технических средств,
        а также возможности достижения заданных значений указанных характеристик.
      </label>
      <textarea
        [ngModel]="_form()?.characteristics"
        (ngModelChange)="emitPatch({ characteristics: $event })"
        [attr.name]="'characteristics_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control"
      placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Перечислите все характеристики и возможности по объекту экспертизы.
          </p>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class CharacteristicsBlockComponent {

  readonly num = input<string>("6");

  readonly full = input<boolean>(true);

  readonly _form = input<CharacteristicsBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<CharacteristicsBlockForm>>();

  emitPatch(patch: Partial<CharacteristicsBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type CharacteristicsBlockForm = {
  characteristics: string;
};
