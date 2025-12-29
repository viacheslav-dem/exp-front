import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-prognosis-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка анализа текущего состояния и прогноза научно-технического развития соответствующей сферы планирования:
      </label>
      <input type="hidden" [(ngModel)]="_form().prognosis" name="prognosis" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().prognosis === true}" (click)="stateButton(true)">
          Достаточна
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().prognosis === false}" (click)="stateButton(false)">
          Недостаточна
        </button>
      </div>
      @if (full()) {
        <textarea [(ngModel)]="_form().prognosisText" name="prognosisText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт оценивает достаточность и достоверность приведенного в материалах объекта государственной экспертизы анализа текущего
            состояния и прогноза (тенденций) научно-технического развития сферы, соответствующей объекту экспертизы (с обязательным указанием
            ссылок на наименования документов и номера страниц, в которых приводится соответствующая информация).
          </p>
          <p>
            Если в материалах по объекту экспертизы информация представлена не в полном объеме (недостаточна), эксперт должен
            указать позиции, по которым необходима доработка материалов.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class PrognosisBlock2025Component {

    readonly num = input<string>("2");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    prognosis: boolean;
    prognosisText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form().prognosis = true;
        } else {
            this._form().prognosis = false;
        }
    }
}