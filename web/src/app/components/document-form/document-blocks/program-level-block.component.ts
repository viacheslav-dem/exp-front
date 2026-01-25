import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-program-level-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность перечня мероприятий по научному обеспечению проекта государственной программы
        в части научно-технического уровня для достижения запланированных государственной программой показателей:
      </label>
      <input type="hidden" [ngModel]="_form()?.programLevel" name="programLevel" required>
      <app-boolean-button
        name="programLevel"
        required
        [ngModel]="_form()?.programLevel"
        [trueLabel]="'достаточно'"
        [falseLabel]="'недостаточно'"
      (ngModelChange)="emitPatch({ programLevel: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.programLevelText" (ngModelChange)="emitPatch({ programLevelText: $event })" name="programLevelText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Выполните анализ перечня, оценку научно-технического уровня мероприятий по
            научному обеспечению (<b>для государственной программы</b>)
            / заданий (<b>для государственной научно-технической программы</b>),
            включенных в перечни, в том числе с учетом целевых показателей, установленных программой.
          </p>
          <p>
            Сделайте вывод о <b>достаточности</b> / <b>недостаточности</b> перечня мероприятий по научному обеспечению
            (<b>для государственной программы</b>) / перечня заданий (<b>для государственной научно-технической программы</b>)
            для достижения запланированных программой целевых показателей.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ProgramLevelBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<ProgramLevelBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ProgramLevelBlockForm>>();

  emitPatch(patch: Partial<ProgramLevelBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ProgramLevelBlockForm = {
  programLevel: boolean;
  programLevelText: string;
};
