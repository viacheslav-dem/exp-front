import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-conclusion-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы 
      </label>
        <br\>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button [disabled]=disabled() type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().conclusion === true}" (click)="stateButton(true)">
          Положительное
        </button>
        <button [disabled]=disabled() type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().conclusion === false}" (click)="stateButton(false)">
          Отрицательное
        </button>
      </div>
      <textarea [(ngModel)]="_form().conclusionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="financeConclusionNum()" class="hint">
        <p>
          <b>Подсказка.</b>
          Положительное решение принимается, если в подпункте {{financeConclusionNum()}} имеется оценка «целесообразно».
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class ConclusionBlockComponent {

  readonly disabled = input<boolean>(false);

  readonly financeConclusionNum = input<string>(undefined);

  readonly _form = input<{
    conclusion: boolean;
    conclusionText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  stateButton(flag: boolean) {
    if(flag){
      this._form().conclusion = true;
    } else {
      this._form().conclusion = false;
    }
  }

}
