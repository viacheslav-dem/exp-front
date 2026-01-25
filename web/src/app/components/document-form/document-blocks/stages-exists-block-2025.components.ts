import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-stages-exists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Целесообразность государственной регистрации объекта государственной экспертизы в соответствии
        с законодательством Республики Беларусь:
      </label>
      <app-dropdown
        name="stagesExist"
        required
        [options]="stagesOptions"
        [ngModel]="_form().stagesExist"
        (ngModelChange)="emitPatch({ stagesExist: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().stagesExistText"
          (ngModelChange)="emitPatch({ stagesExistText: $event })"
          name="stagesExistText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"
        ></textarea>
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

    readonly _form = input<StagesExistsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<StagesExistsBlock2025Form>>();

    emitPatch(patch: Partial<StagesExistsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type StagesExistsBlock2025Form = {
    stagesExist: string;
    stagesExistText: string;
};