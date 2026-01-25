import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-conclusion-8-13-block-2025',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>

      <label>
        Целесообразность реализации объекта государственной экспертизы:
      </label>
        <input type="hidden" [ngModel]="_form().conclusion" name="conclusion" required>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().conclusion === true}" (click)="stateButton(true)">
                Целесообразно
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().conclusion === false}" (click)="stateButton(false)">
                Нецелесообразно
            </button>
        </div>
      <textarea
        [ngModel]="_form().conclusionText"
        (ngModelChange)="emitPatch({ conclusionText: $event })"
        name="conclusionText"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"
      ></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Решение о <b>целесообразности</b> реализации объекта экспертизы принимается только
          при <b>соответствии</b> (<b>достаточности</b>)
          объекта государственной экспертизы всем требованиям выше.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_13_Block2025Component {

    readonly disabled = input<boolean>(false);

    readonly _form = input<Conclusion_8_13_Block2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<Conclusion_8_13_Block2025Form>>();

    emitPatch(patch: Partial<Conclusion_8_13_Block2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ conclusion: flag });
    }
}

type Conclusion_8_13_Block2025Form = {
    conclusion: boolean;
    conclusionText: string;
};