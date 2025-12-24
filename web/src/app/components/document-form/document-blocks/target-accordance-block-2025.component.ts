import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-target-accordance-block-2025',
    template: `
        <div class="form-sub-group">
          <label>
            {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
          </label>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().targetAccordance === true}" (click)="stateButton(true)">
              Соответствует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().targetAccordance === false && _form().targetAccordance !== undefined}" (click)="stateButton(false)">
              Не соответствует
            </button>
          </div>
          @if (!_form().targetAccordance) {
            <label>Рекомендуемые цели:</label>
            <textarea [(ngModel)]="_form().targetSuggestion" rows="2" class="form-control"
              title="Рекомендуемые цели"
            placeholder="Рекомендуемые цели"></textarea>
          }
          @if (full()) {
            <textarea [(ngModel)]="_form().targetAccordanceText" rows="3" class="form-control mt-05"
            placeholder="Обязательный текст"></textarea>
          }
        </div>
        `,
    standalone: false
})
export class TargetAccordanceBlock2025Component {

    readonly num = input<string>("10.6");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    targetAccordance: boolean;
    targetSuggestion: string;
    targetAccordanceText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form().targetAccordance = true;
        } else {
            this._form().targetAccordance = false;
        }
    }
}

