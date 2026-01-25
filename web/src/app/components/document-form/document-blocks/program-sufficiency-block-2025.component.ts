import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-program-sufficiency-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий
        государственной научно-технической программы для достижения запланированных программой целевых показателей:
      </label>
      <input type="hidden" [ngModel]="_form().programSufficiency" name="programSufficiency" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().programSufficiency === true}" (click)="stateButton(true)">
          Достаточен
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().programSufficiency === false}" (click)="stateButton(false)">
          Недостаточен
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form().programSufficiencyText"
          (ngModelChange)="emitPatch({ programSufficiencyText: $event })"
          name="programSufficiencyText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"
        ></textarea>
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

    readonly _form = input<ProgramSufficiencyBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ProgramSufficiencyBlock2025Form>>();

    emitPatch(patch: Partial<ProgramSufficiencyBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ programSufficiency: flag });
    }
}

type ProgramSufficiencyBlock2025Form = {
    programSufficiency: boolean;
    programSufficiencyText: string;
};
