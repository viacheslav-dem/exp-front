import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-stages-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{ num() }}. Наличие в календарном плане этапов реализации объекта государственной экспертизы, подлежащих
        государственной
        регистрации в соответствии с законодательством Республики Беларусь:
      </label>
      <input type="hidden" [ngModel]="_form().stages" name="stages" required>
      <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().stages === true}"
        (click)="stateButton(true)">
        Имеются
      </button>
      <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().stages === false}"
        (click)="stateButton(false)">
        Не имеются
      </button>
    
      @if (full() || _form().stages) {
        <textarea
          [ngModel]="_form().stagesText"
          (ngModelChange)="emitPatch({ stagesText: $event })"
          name="stagesText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
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
export class StagesBlock2025Component {

  readonly num = input<string>('19.1');

  readonly full = input<boolean>(true);

  readonly _form = input<StagesBlock2025Form>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<StagesBlock2025Form>>();

  emitPatch(patch: Partial<StagesBlock2025Form>) {
      // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
      this.formPatch.emit(patch);
      // Оставляем событие для обратной совместимости (часть форм привязана к нему).
      this.onConditionsChanged.emit(true);
  }

  stateButton(flag: boolean) {
      this.emitPatch({ stages: flag });
  }

}

type StagesBlock2025Form = {
    stages: boolean;
    stagesText: string;
};
