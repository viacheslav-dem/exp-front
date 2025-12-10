import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-characteristics-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Функциональные, технические, технологические и другие характеристики создаваемых и приобретаемых программного обеспечения,
        технических средств и (или) комплексов программно-технических средств, а также возможности достижения заданных значений указанных характеристик:
      </label>
      <textarea [(ngModel)]="_form.characteristics" rows="3" class="form-control"
      placeholder="Обязательный текст."></textarea>
      @if (full) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен перечислить все характеристики и возможности по объекту экспертизы.
          </p>
          <p>
            Если в материалах по объекту экспертизы отсутствует данная информация, эксперт должен однозначно указать
            в пункте заключения фразу: «Не представлено в материалах по объекту экспертизы».
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class CharacteristicsBlock2025Component {

    @Input()
    num: string = "6";

    @Input()
    full: boolean = true;

    @Input()
    _form: { characteristics: string };
}