import {Component, effect, input, output} from "@angular/core";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
    selector: 'app-terms-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие сроков выполнения объекта государственной экспертизы необходимым:
      </label>
      <input type="hidden" [ngModel]="_form.termsAccordance" name="termsAccordance" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.termsAccordance === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.termsAccordance === false && _form.termsAccordance !== undefined}" (click)="stateButton(false)">
          Не соответствует
        </button>
      </div>
      @if (!_form.termsAccordance) {
        <label class="ml-2">Рекомендуемые сроки реализации:</label>
        <div class="input-group">
          <app-date-period class="form-control mt-2" [(ngModel)]="_terms"
          (ngModelChange)="onTermsChanged()"></app-date-period>
        </div>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form.termsAccordanceText"
          (ngModelChange)="emitPatch({ termsAccordanceText: $event })"
          [name]="'termsAccordanceText_' + num().split('.').join('_')"
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
export class TermsAccordanceBlock2025Component {

    _terms: DateRange;
    _form: { termsAccordance: boolean, termsSuggestion: PeriodDto, termsAccordanceText: string };

    readonly num = input<string>("10.2");

    readonly full = input<boolean>(true);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<{ termsAccordance: boolean, termsSuggestion: PeriodDto, termsAccordanceText: string }>>();

    readonly form = input<{ termsAccordance: boolean, termsSuggestion: PeriodDto, termsAccordanceText: string }>(undefined);

    emitPatch(patch: Partial<{ termsAccordance: boolean, termsSuggestion: PeriodDto, termsAccordanceText: string }>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    private readonly formEffect = effect(() => {
        const _form = this.form();
        if (!_form) {
            return;
        }
        this._form = _form;
        const start = _form.termsSuggestion?.start ?? null;
        const end = _form.termsSuggestion?.end ?? null;
        // Обновляем _terms только при реальном изменении дат, иначе новый объект DateRange
        // триггерит writeValue в app-date-period → при открытии календаря бесконечный цикл
        const same = this._terms != null
            && (this._terms.start === start || (this._terms.start == null && start == null))
            && (this._terms.end === end || (this._terms.end == null && end == null));
        if (!same) {
            this._terms = new DateRange(start, end);
        }
    });

    onTermsChanged() {
        // Используем emitPatch вместо прямой мутации
        this.emitPatch({ termsSuggestion: new PeriodDto(this._terms.start, this._terms.end) });
    }

    stateButton(flag: boolean){
        this.emitPatch({ termsAccordance: flag });
    }

}
