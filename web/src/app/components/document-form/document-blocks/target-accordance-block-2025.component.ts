import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-target-accordance-block-2025',
    template: `
        <div class="form-sub-group">
          <label>
            {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
          </label>
          <input type="hidden" [ngModel]="_form()?.targetAccordance" name="targetAccordance" required>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.targetAccordance === true}" (click)="stateButton(true)">
              Соответствует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.targetAccordance === false && _form()?.targetAccordance !== undefined}" (click)="stateButton(false)">
              Не соответствует
            </button>
          </div>
          @if (!_form()?.targetAccordance) {
            <label>Рекомендуемые цели:</label>
            <textarea
              [ngModel]="_form()?.targetSuggestion"
              (ngModelChange)="emitPatch({ targetSuggestion: $event })"
              name="targetSuggestion"
              rows="2"
              class="form-control"
              title="Рекомендуемые цели"
              placeholder="Рекомендуемые цели"
            ></textarea>
          }
          @if (full()) {
            <textarea
              [ngModel]="_form()?.targetAccordanceText"
              (ngModelChange)="emitPatch({ targetAccordanceText: $event })"
              [name]="'targetAccordanceText_' + num().split('.').join('_')"
              required
              minlength="30"
              maxlength="5000"
              rows="3"
              class="form-control mt-05"
              placeholder="Обязательный текст"></textarea>
          }
        </div>
        `,
    standalone: false
})
export class TargetAccordanceBlock2025Component {

    readonly num = input<string>("10.6");

    readonly full = input<boolean>(true);

    readonly _form = input<TargetAccordanceBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<TargetAccordanceBlock2025Form>>();

    emitPatch(patch: Partial<TargetAccordanceBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ targetAccordance: flag });
    }
}

type TargetAccordanceBlock2025Form = {
    targetAccordance: boolean;
    targetSuggestion: string;
    targetAccordanceText: string;
};

