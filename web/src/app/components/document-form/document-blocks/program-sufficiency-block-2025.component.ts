import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-program-sufficiency-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий
        государственной научно-технической программы для достижения запланированных программой целевых показателей:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.programSufficiency === true}" (click)="stateButton(true)">
                Достаточен
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.programSufficiency === false}" (click)="stateButton(false)">
                Недостаточен
            </button>
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.programSufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
          <p>
              <b>Подсказка.</b>
              Эксперт:
          </p>
          <ul>
              <li>
                  -  выполняет анализ перечня, оценку научно-технического уровня мероприятий по научному обеспечению (для государственной
                  программы) / заданий (для государственной научно-технической программы), включенных в перечни, их объема финансирования, в том
                  числе с учетом целевых показателей, установленных программой;
              </li>
              <li>
                  -  делает вывод о достаточности / недостаточности перечня мероприятий по научному обеспечению (для государственной
                  программы) / перечня заданий (для государственной научно-технической программы) для достижения запланированных программой целевых
                  показателей.
              </li>
          </ul>
        <p>
            При формировании перечня мероприятий по научному обеспечению (для государственной программы, за исключением государственной
            программы в сфере цифрового развития) /заданий (для государственной научно-технической программы) в отрыве от цели и задач программы или
            включении в перечень мероприятий по научному обеспечению (для государственной программы, за исключением государственной
            программы в сфере цифрового развития) прикладных научных исследований и разработок, результаты которых предполагают создание
            товаров (в том числе, при отсутствии выпуска вновь освоенной продукции), реализация таких мероприятий рекомендуется в рамках
            научно-технических программ.

        </p>
      </div>
    </div>
  `
})
export class ProgramSufficiencyBlock2025Component {

    @Input()
    num: string = "4";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        programSufficiency: boolean;
        programSufficiencyText: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form.programSufficiency = true;
        } else {
            this._form.programSufficiency = false;
        }
    }
}
