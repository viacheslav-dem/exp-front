import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-name-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта государственной экспертизы своему наименованию:
      </label>
      <input type="hidden" [(ngModel)]="_form().nameAccordance" name="nameAccordance" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().nameAccordance === true}" (click)="stateButton(true)">
          Соответсвует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().nameAccordance === false && _form().nameAccordance !== undefined}" (click)="stateButton(false)">
          Не соотвествует
        </button>
      </div>
      @if (!_form().nameAccordance) {
        <label class="ml-2">Рекомендуемое наименование:</label>
        <textarea [(ngModel)]="_form().nameSuggestion" name="nameSuggestion" required rows="2" class="form-control mt-2"
          title="Рекомендуемое наименование"
        placeholder="Предлагаемое наименование"></textarea>
      }
      @if (full()) {
        <textarea
          [(ngModel)]="_form().nameAccordanceText"
          [attr.name]="'nameAccordanceText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class NameAccordanceBlock2025Component {

    readonly num = input<string>("10.1");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    nameAccordance: boolean;
    nameSuggestion: string;
    nameAccordanceText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();


    stateButton(flag: boolean) {
        if(flag){
            this._form().nameAccordance = true;
        } else{
            this._form().nameAccordance = false;
        }
    }
}
