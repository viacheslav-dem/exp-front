import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-program-sufficiency-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий
        государственной научно-технической программы для достижения запланированных программой целевых показателей:
      </label>
      <app-boolean-button [(ngModel)]="_form.programSufficiency" [trueLabel]="'достаточен'"
                          [falseLabel]="'недостаточен'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.programSufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Выполните анализ перечня, оценку научно-технического уровня мероприятий по 
          научному обеспечению (<b>для государственной программы</b>) 
          / заданий (<b>для государственной научно-технической программы</b>), 
          включенных в перечни, их объема финансирования в том числе с учетом целевых показателей, установленных программой.
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
export class ProgramSufficiencyBlockComponent {

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
}
