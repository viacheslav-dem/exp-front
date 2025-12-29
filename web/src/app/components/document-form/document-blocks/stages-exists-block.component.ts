import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-stages-exists-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Льготирование реализации объекта государственной экспертизы.
        Целесообразность государственной регистрации объекта государственной экспертизы в соответствии
        с законодательством Республики Беларусь:
      </label>
      <app-dropdown
        [options]="stagesOptions"
        [(ngModel)]="_form().stagesExist"
        [attr.name]="'stagesExist_' + num().split('.').join('_')"
        required
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().stagesExistText"
          [attr.name]="'stagesExistText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
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
export class StagesExistsBlockComponent {

  stagesOptions: string[] = [
    'целесообразно',
    'нецелесообразно',
  ];

  readonly num = input<string>("8");

  readonly full = input<boolean>(true);

  readonly askStages = input<boolean>(true);

  readonly _form = input<{
    stagesExist: string;
    stagesExistText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
