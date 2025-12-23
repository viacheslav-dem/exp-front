import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-finance-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие заявленного финансирования планируемому объему выполняемых работ:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().financeAccordance === true}" (click)="stateButton(true)">
          Соответсвует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().financeAccordance === false && _form().financeAccordance !== undefined}" (click)="stateButton(false)">
          Не соотвествует
        </button>
      </div>
      @if (!_form().financeAccordance) {
        <label class="ms-2">Рекомендуемый объем финансирования, {{project()?.currency?.name || 'руб.'}}:</label>
        <div class="input-group mt-2">
          <input [(ngModel)]="_form().financeSuggestion" min="0" numberInput type="text" class="form-control"
            [title]="'Рекомендуемый объем финансирования, ' + (project()?.currency?.name || 'руб.')"
            [placeholder]="'сумма, ' + (project()?.currency?.name || 'руб.')">
          </div>
        }
        @if (full()) {
          <textarea [(ngModel)]="_form().financeAccordanceText" rows="3" class="form-control mt-05"
          placeholder="Обязательный текст"></textarea>
        }
      </div>
    `,
    standalone: false
})
export class FinanceAccordanceBlock2025Component {

    readonly num = input<string>("10.5");

    readonly full = input<boolean>(true);

    readonly isTextRequired = input<boolean>(false);

    readonly _form = input<{
    financeAccordance: boolean;
    financeSuggestion: number;
    financeAccordanceText: string;
}>(undefined);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form().financeAccordance = true;
        } else {
            this._form().financeAccordance = false;
        }
    }

}
