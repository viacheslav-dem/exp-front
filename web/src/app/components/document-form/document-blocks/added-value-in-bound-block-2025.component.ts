import {Component, input} from "@angular/core";
import {IndustryDto} from "@app/dto/IndustryDto";

@Component({
    selector: 'app-added-value-in-bound-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Организация технологического процесса, обеспечивающего средний уровень добавленной стоимости на одного
        работающего, аналогичный среднему уровню добавленной стоимости на одного работающего по соответствующему виду
        экономической деятельности в Европейском союзе либо превышающий этот уровень:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().addedValue >= _form().section?.addedValueBound}">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().addedValue < _form().section?.addedValueBound}">
          Не соответствует
        </button>
      </div>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен сделать вывод о соответствии или несоответствии; если в настоящем заключении значение в подпункте 8.2.2 больше
            или равно значению в подпункте 8.2.1, то соответствует, если менее, то не соответствует.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class AddedValueInBoundBlock2025Component {

    readonly num = input<string>("2.3");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    addedValue: number;
    section: IndustryDto;
}>(undefined);

}
