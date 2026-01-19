import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-technology-type-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Использование технологий V или VI технологических укладов:
      </label>
      <div>
        <span>V технологический уклад: </span>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().technologyType5 === true}" (click)="stateButtonTechnologyType5(true)">
            Да
          </button>
          <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().technologyType5 === false}" (click)="stateButtonTechnologyType5(false)">
            Нет
          </button>
        </div>
      </div>
      <div>
        <span>VI технологический уклад: </span>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().technologyType6 === true}" (click)="stateButtonTechnologyType6(true)">
            Да
          </button>
          <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().technologyType6 === false}" (click)="stateButtonTechnologyType6(false)">
            Нет
          </button>
        </div>
      </div>
      <div>
        <span>проект другого технологического уклада: </span>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().technologyOtherType === true}" (click)="stateButtonTechnologyOtherType(true)">
            Да
          </button>
          <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().technologyOtherType === false}" (click)="stateButtonTechnologyOtherType(false)">
            Нет
          </button>
        </div>
      </div>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().technologyTypeText"
          [attr.name]="'technologyTypeText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст"
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TechnologyTypeBlock2025Component {

    readonly num = input<string>("1.3");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    technologyType5: boolean;
    technologyType6: boolean;
    technologyOtherType: boolean;
    technologyTypeText: string;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();

    stateButtonTechnologyType5(flag: boolean) {
        if(flag){
            this._form().technologyType5 = true;
        } else{
            this._form().technologyType5 = false;
        }
    }

    stateButtonTechnologyType6(flag: boolean) {
        if(flag){
            this._form().technologyType6 = true;
        } else{
            this._form().technologyType6 = false;
        }
    }

    stateButtonTechnologyOtherType(flag: boolean) {
        if(flag){
            this._form().technologyOtherType = true;
        } else{
            this._form().technologyOtherType = false;
        }
    }

}