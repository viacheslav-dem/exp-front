import {Component, input} from "@angular/core";

@Component({
    selector: 'app-characteristics-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Функциональные, технические, технологические и другие характеристики создаваемых и приобретаемых программного обеспечения,
        технических средств и (или) комплексов программно-технических средств, а также возможности достижения заданных значений указанных характеристик:
      </label>
      <textarea [(ngModel)]="_form().characteristics" name="characteristics" required minlength="30" rows="3" class="form-control"
      placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      @if (full()) {
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

    readonly num = input<string>("6");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    characteristics: string;
}>(undefined);
}