import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-program-level-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность перечня мероприятий по научному обеспечению проекта государственной программы 
        в части научно-технического уровня для достижения запланированных государственной программой показателей:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.programLevel"
        [trueLabel]="'достаточно'"
        [falseLabel]="'недостаточно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.programLevelText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
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
    </div>
  `
})
export class ProgramLevelBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { programLevel: boolean, programLevelText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
