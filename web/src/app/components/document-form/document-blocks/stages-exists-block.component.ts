import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-stages-exists-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Льготирование реализации объекта государственной экспертизы.
        Целесообразность государственной регистрации объекта государственной экспертизы в соответствии
        с законодательством Республики Беларусь:
      </label>
      <app-dropdown [options]="stagesOptions" [(ngModel)]="_form.stagesExist"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.stagesExistText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full && askStages" class="hint">
        <p>
          <b>Подсказка.</b>
          При наличии в календарном плане этапов, подлежащих
          государственной регистрации, перечисляются номера данных этапов.
        </p>
      </div>
    </div>
  `
})
export class StagesExistsBlockComponent {

  stagesOptions: string[] = [
    'целесообразно',
    'нецелесообразно',
  ];

  @Input()
  num: string = "8";

  @Input()
  full: boolean = true;

  @Input()
  askStages: boolean = true;

  @Input()
  _form: { stagesExist: string, stagesExistText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
