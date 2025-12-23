import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-program-sufficiency-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий
        государственной научно-технической программы для достижения запланированных программой целевых показателей:
      </label>
      <input type="hidden" [(ngModel)]="_form().programSufficiency" name="programSufficiency" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().programSufficiency === true}" (click)="stateButton(true)">
          Достаточен
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().programSufficiency === false}" (click)="stateButton(false)">
          Недостаточен
        </button>
      </div>
      @if (full()) {
        <textarea [(ngModel)]="_form().programSufficiencyText" name="programSufficiencyText" required minlength="30" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
      }
      @if (full()) {
        <div class="hint">
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
      }
    </div>
    `,
    standalone: false
})
export class ProgramSufficiencyBlock2025Component {

    readonly num = input<string>("4");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    programSufficiency: boolean;
    programSufficiencyText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form().programSufficiency = true;
        } else {
            this._form().programSufficiency = false;
        }
    }
}
