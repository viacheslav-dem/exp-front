import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-stages-exists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Целесообразность государственной регистрации объекта государственной экспертизы в соответствии
        с законодательством Республики Беларусь:
      </label>
      <app-dropdown [options]="stagesOptions" [(ngModel)]="_form().stagesExist"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().stagesExistText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full() && askStages()) {
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

    readonly num = input<string>("9");

    readonly full = input<boolean>(true);

    readonly askStages = input<boolean>(true);

    readonly _form = input<{
    stagesExist: string;
    stagesExistText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}