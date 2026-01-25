import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-novelty-exists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание и внедрение новых технологий и (или) производство новой для Республики Беларусь
        и (или) мировой экономики продукции:
      </label>
      <input type="hidden" [ngModel]="_form()?.noveltyExists" name="noveltyExists" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.noveltyExists === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.noveltyExists === false}" (click)="stateButton(false)">
          Не соответствует
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.noveltyExistsText"
          (ngModelChange)="emitPatch({ noveltyExistsText: $event })"
          [name]="'noveltyExistsText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен сделать вывод о соответствии или о несоответствии с учетом изложенного им в подпунктах 1 – 8.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class NoveltyExistsBlock2025Component {

    readonly num = input<string>("1.2");

    readonly full = input<boolean>(true);

    readonly _form = input<NoveltyExistsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<NoveltyExistsBlock2025Form>>();

    emitPatch(patch: Partial<NoveltyExistsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ noveltyExists: flag });
    }
}

type NoveltyExistsBlock2025Form = {
    noveltyExists: boolean;
    noveltyExistsText: string;
};
