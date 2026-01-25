import {Component, input, output} from '@angular/core';

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
        [ngModel]="_form()?.stagesExist"
        [name]="'stagesExist_' + num().split('.').join('_')"
        required
        (ngModelChange)="emitPatch({ stagesExist: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.stagesExistText"
          (ngModelChange)="emitPatch({ stagesExistText: $event })"
          [name]="'stagesExistText_' + num().split('.').join('_')"
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

  readonly _form = input<StagesExistsBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<StagesExistsBlockForm>>();

  emitPatch(patch: Partial<StagesExistsBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type StagesExistsBlockForm = {
  stagesExist: string;
  stagesExistText: string;
};
