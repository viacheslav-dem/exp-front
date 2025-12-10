import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-program-sufficiency-finance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность перечня мероприятий по научному обеспечению проекта государственной программы
        в части объемов их финансирования для достижения запланированных государственной программой показателей:
      </label>
      <app-boolean-button [(ngModel)]="_form().programSufficiency"
        [trueLabel]="'достаточно'"
        [falseLabel]="'недостаточно'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().programSufficiencyText" rows="3" class="form-control mt-05"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Выполните анализ перечня, оценку объема финансирования мероприятий по
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
export class ProgramSufficiencyFinanceBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    programSufficiency: boolean;
    programSufficiencyText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
