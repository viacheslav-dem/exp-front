import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-program-sufficiency-finance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность перечня мероприятий по научному обеспечению проекта государственной программы 
        в части объемов их финансирования для достижения запланированных государственной программой показателей:
      </label>
      <app-boolean-button [(ngModel)]="_form.programSufficiency"
                          [trueLabel]="'достаточно'"
                          [falseLabel]="'недостаточно'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.programSufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
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
    </div>
  `
})
export class ProgramSufficiencyFinanceBlockComponent {

  @Input()
  num: string = "2";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    programSufficiency: boolean;
    programSufficiencyText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
