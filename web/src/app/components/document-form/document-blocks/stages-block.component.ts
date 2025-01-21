import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-stages-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Наличие в календарном плане этапов реализации объекта государственной экспертизы, подлежащих государственной 
        регистрации в соответствии с законодательством Республики Беларусь:
      </label>
      <app-boolean-button [(ngModel)]="_form.stages" [trueLabel]="'имеются'"
                          [falseLabel]="'не имеются'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full || _form.stages" [(ngModel)]="_form.stagesText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          При наличии в календарном плане этапов, подлежащих
          государственной регистрации, перечисляются номера данных этапов.
        </p>
      </div>
    </div>
  `
})
export class StagesBlockComponent {

  @Input()
  num: string = '9.2';

  @Input()
  full: boolean = true;

  @Input()
  _form: { stages: boolean, stagesText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
