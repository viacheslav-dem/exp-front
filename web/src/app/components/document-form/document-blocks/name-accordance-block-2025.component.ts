import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-name-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта государственной экспертизы своему наименованию:
      </label>
      <input type="hidden" [ngModel]="_form()?.nameAccordance" name="nameAccordance" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.nameAccordance === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.nameAccordance === false && _form()?.nameAccordance !== undefined}" (click)="stateButton(false)">
          Не соответствует
        </button>
      </div>
      @if (!_form()?.nameAccordance) {
        <label class="ml-2">Рекомендуемое наименование:</label>
        <textarea
          [ngModel]="_form()?.nameSuggestion"
          (ngModelChange)="emitPatch({ nameSuggestion: $event })"
          name="nameSuggestion"
          rows="2"
          class="form-control mt-2"
          title="Рекомендуемое наименование"
          placeholder="Предлагаемое наименование"
        ></textarea>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form()?.nameAccordanceText"
          (ngModelChange)="emitPatch({ nameAccordanceText: $event })"
          [name]="'nameAccordanceText_' + num().split('.').join('_')"
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
export class NameAccordanceBlock2025Component {

    readonly num = input<string>("10.1");

    readonly full = input<boolean>(true);

    readonly _form = input<NameAccordanceBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<NameAccordanceBlock2025Form>>();

    emitPatch(patch: Partial<NameAccordanceBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ nameAccordance: flag });
    }
}

type NameAccordanceBlock2025Form = {
    nameAccordance: boolean;
    nameSuggestion: string;
    nameAccordanceText: string;
};
