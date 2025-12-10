import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-stages-exists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Целесообразность государственной регистрации объекта государственной экспертизы в соответствии
        с законодательством Республики Беларусь:
      </label>
      <app-dropdown [options]="stagesOptions" [(ngModel)]="_form.stagesExist"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full) {
        <textarea [(ngModel)]="_form.stagesExistText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full && askStages) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            При наличии в календарном плане этапов, подлежащих
            государственной регистрации, перечисляются номера данных этапов.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class StagesExistsBlock2025Component {

    stagesOptions: string[] = [
        'целесообразно',
        'нецелесообразно',
    ];

    @Input()
    num: string = "9";

    @Input()
    full: boolean = true;

    @Input()
    askStages: boolean = true;

    @Input()
    _form: { stagesExist: string, stagesExistText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}