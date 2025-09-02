import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-target-analysis-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Анализ целевых показателей:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.targetAnalysis === true}" (click)="stateButton(true)">
                Достаточны
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.targetAnalysis === false}" (click)="stateButton(false)">
                Недостаточны
            </button>
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.targetAnalysisText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
            Эксперт:
        </p>
          <ul>
              <li>
                  -  выполняет анализ целевых показателей, установленных в объекте экспертизы, оценивает их обоснованность, соответствие целям
                  программы, значения;
              </li>
              <li>
                  - делает вывод о достаточности / недостаточности перечня целевых показателей и их значений, установленных объектом
                  экспертизы, для научно-технического обеспечения решения наиболее значимых народнохозяйственных, экологических, социальных и иных
                  проблем Республики Беларусь.
              </li>
          </ul>
      </div>
    </div>
  `
})
export class TargetAnalysisBlock2025Component {

    @Input()
    num: string = "3";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        targetAnalysis: boolean;
        targetAnalysisText: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form.targetAnalysis = true;
        } else {
            this._form.targetAnalysis = false;
        }
    }
}