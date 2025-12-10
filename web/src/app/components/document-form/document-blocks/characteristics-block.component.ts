import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-characteristics-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Функциональные, технические, технологические и другие характеристики создаваемых и приобретаемых
        программного обеспечения, технических средств и (или) комплексов программно-технических средств,
        а также возможности достижения заданных значений указанных характеристик.
      </label>
      <textarea [(ngModel)]="_form.characteristics" rows="3" class="form-control"
      placeholder="Обязательный текст."></textarea>
      @if (full) {
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

  @Input()
  num: string = "6";

  @Input()
  full: boolean = true;

  @Input()
  _form: { characteristics: string };
}
