import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-conclusion-8-14-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Целесообразность реализации и финансирования за счет средств республиканского бюджета и (или) других источников финансирования:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().conclusion === true}" (click)="stateButton(true)">
                Целесообразно
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().conclusion === false}" (click)="stateButton(false)">
                Нецелесобразно
            </button>
        </div>
      <textarea [(ngModel)]="_form().conclusionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          В случае указания целесообразности экспертное заключение считается <b>положительным</b>, 
          а в случае указания нецелесообразности – <b>отрицательным</b>.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_14_BlockComponent {

    readonly num = input<string>("1");

    readonly disabled = input<boolean>(false);

    readonly _form = input<{
    conclusion: boolean;
    conclusionText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form().conclusion = true;
        } else {
            this._form().conclusion = false;
        }
    }
}