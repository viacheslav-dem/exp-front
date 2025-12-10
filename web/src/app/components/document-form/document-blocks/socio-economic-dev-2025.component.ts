import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-socio-economic-dev-2025',
    template: `
        <div class="form-sub-group">
          <label>
            {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
          </label>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().socioEconomic === true}" (click)="stateButton(true)">
              Соответсвует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().socioEconomic === false}" (click)="stateButton(false)">
              Не соотвествует
            </button>
          </div>
          @if (full()) {
            <textarea [(ngModel)]="_form().socioEconomicText" rows="3" class="form-control mt-05"
            placeholder="Обязательный текст"></textarea>
          }
        </div>
        `,
    standalone: false
})
export class SocioEconomivDev2025Component {

    readonly num = input<string>("10.6");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    socioEconomic: boolean;
    socioEconomicText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form().socioEconomic = true;
        } else {
            this._form().socioEconomic = false;
        }
    }
}
