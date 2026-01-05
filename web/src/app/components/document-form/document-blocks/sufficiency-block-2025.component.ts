import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-sufficiency-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность запланированных этапов работ (услуг), создаваемого и приобретаемого программного обеспечения,
        технических средств и (или) комплексов программно-технических средств для достижения целей государственной программы,
        либо перечня научных исследований и разработок по развитию государственной системы научно-технической информации Республики Беларусь:
      </label>
      <input type="hidden" [(ngModel)]="_form().sufficiency" name="sufficiency" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().sufficiency === true}" (click)="stateButton(true)">
          Достаточно
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().sufficiency === false}" (click)="stateButton(false)">
          Недостаточно
        </button>
      </div>
      @if (!_form().sufficiency) {
        <label>Рекомендуется добавить:</label>
        <textarea
          [(ngModel)]="_form().sufficiencySuggestion" name="sufficiencySuggestion" required maxlength="5000" rows="2" class="form-control"
          title="Рекомендуется добавить"
          placeholder="перечисление ресурсов, которые необходимо добавить в процессе реализации объекта экспертизы"
        ></textarea>
      }
      @if (full()) {
        <textarea [(ngModel)]="_form().sufficiencyText" name="sufficiencyText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class SufficiencyBlock2025Component {

    readonly num = input<string>("4");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    sufficiency: boolean;
    sufficiencyText: string;
    sufficiencySuggestion: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form().sufficiency = true;
        } else {
            this._form().sufficiency = false;
        }
    }
}