import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-finance-conclusion-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств
        республиканского бюджета и (или) других источников финансирования:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button [disabled]=disabled type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.financeConclusion === true}" (click)="stateButton(true)">
          Целесобразно
        </button>
        <button [disabled]=disabled type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.financeConclusion === false}" (click)="stateButton(false)">
          Нецелесобразно
        </button>
      </div>
      @if (full) {
        <textarea [(ngModel)]="_form.financeConclusionText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if ((full || disabled) && noveltyNum && economicSignificanceNum) {
        <div class="hint">
          <p class="mb-0">
            <b>Подсказка.</b>
            Решение о целесообразности финансирования принимается только при соответствии объекта
            государственной экспертизы следующим обязательным условиям:
          </p>
          <ul>
            <li>
              оценка <b>«новый для Республики Беларусь»</b>, <b>«новый для стран СНГ»</b>,
              <b>«новизна мирового уровня»</b> в пункте <b>Новизна (инновационность)</b>;
            </li>
            @if (project.code.code == '8.8БИФ') {
              <div >
                <li>
                  использование в венчурном проекте технологий V или VI технологических укладов (соответствующая оценка «да» в подпункте 1.3);
                </li>
              </div>
            }
            <li>
              оценка <b>«средняя»</b> или <b>«высокая»</b> в пункте <b>Потребность республики в результатах</b>.
            </li>
          </ul>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class FinanceConclusionBlock2025Component {

    ngOnInit(){
        this._form.financeConclusion = false;
    }


    @Input()
    num: string = "10.6";

    @Input()
    noveltyNum: string;

    @Input()
    economicSignificanceNum: string;

    @Input()
    full: boolean = true;

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Input()
    disabled: boolean = false;

    @Input()
    _form: { financeConclusion: boolean, financeConclusionText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form.financeConclusion = true;
        } else {
            this._form.financeConclusion = false;
        }
    }

}
