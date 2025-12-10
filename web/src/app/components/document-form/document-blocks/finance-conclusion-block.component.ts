import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-finance-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств
        республиканского бюджета и (или) других источников финансирования:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button [disabled]=disabled() type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().financeConclusion === true}" (click)="stateButton(true)">
          Целесобразно
        </button>
        <button [disabled]=disabled() type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().financeConclusion === false}" (click)="stateButton(false)">
          Нецелесобразно
        </button>
      </div>
      @if (full()) {
        <textarea [(ngModel)]="_form().financeConclusionText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if ((full() || disabled()) && noveltyNum() && economicSignificanceNum()) {
        <div class="hint">
          <p class="mb-0">
            <b>Подсказка.</b>
            Решение о целесообразности финансирования принимается только при соответствии объекта
            государственной экспертизы следующим обязательным условиям:
          </p>
          <ul>
            <li>
              оценка <b>«новый для Республики Беларусь»</b>, <b>«новый для стран СНГ»</b>,
              <b>«новизна мирового уровня»</b> в пункте 1;
            </li>
            @if (project().code.code == '8.8БИФ') {
              <div >
                <li>
                  использование в венчурном проекте технологий V или VI технологических укладов (соответствующая оценка «да» в подпункте 1.3);
                </li>
              </div>
            }
            <li>
              оценка <b>«средняя»</b> или <b>«высокая»</b> в пункте 2.
            </li>
          </ul>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class FinanceConclusionBlockComponent {

  ngOnInit(){
    this._form().financeConclusion = false;
  }


  readonly num = input<string>("10.6");

  readonly noveltyNum = input<string>(undefined);

  readonly economicSignificanceNum = input<string>(undefined);

  readonly full = input<boolean>(true);

  readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

  readonly disabled = input<boolean>(false);

  readonly _form = input<{
    financeConclusion: boolean;
    financeConclusionText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  stateButton(flag: boolean) {
    if(flag){
      this._form().financeConclusion = true;
    } else {
      this._form().financeConclusion = false;
    }
  }

}
