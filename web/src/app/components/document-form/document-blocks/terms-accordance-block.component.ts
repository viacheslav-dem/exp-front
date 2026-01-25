import {Component, effect, input, output, untracked} from '@angular/core';
import {PeriodDto} from "@app/dto/PeriodDto";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";

@Component({
    selector: 'app-terms-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие сроков выполнения объекта государственной экспертизы необходимым:
      </label>
      <input type="hidden" [ngModel]="_form()?.termsAccordance" name="termsAccordance" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.termsAccordance === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.termsAccordance === false && _form()?.termsAccordance !== undefined}" (click)="stateButton(false)">
          Не соответствует
        </button>
      </div>
      @if (!_form()?.termsAccordance) {
        <label class="ml-2">Рекомендуемые сроки реализации:</label>
        <div class="input-group">
          <app-date-period
            class="form-control mt-2"
            [ngModel]="_terms"
            (ngModelChange)="onTermsChanged($event)"
          ></app-date-period>
        </div>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form()?.termsAccordanceText"
          (ngModelChange)="emitPatch({ termsAccordanceText: $event })"
          [name]="'termsAccordanceText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст"
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TermsAccordanceBlockComponent {

  _terms: DateRange;

  readonly num = input<string>("10.2");

  readonly full = input<boolean>(true);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<TermsAccordanceBlockForm>>();

  readonly _form = input<TermsAccordanceBlockForm>(undefined, { alias: 'form' });

  private readonly formEffect = effect(() => {
    const form = this._form();
    if (!form) {
      return;
    }
    const start = form.termsSuggestion?.start ?? null;
    const end = form.termsSuggestion?.end ?? null;
    untracked(() => {
      this._terms = new DateRange(start, end);
    });
  });

  emitPatch(patch: Partial<TermsAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }

  onTermsChanged(terms: DateRange) {
    this._terms = terms;
    this.emitPatch({
      termsSuggestion: new PeriodDto(terms.start, terms.end)
    });
  }

  stateButton(flag: boolean) {
    this.emitPatch({ termsAccordance: flag });
  }
}

type TermsAccordanceBlockForm = {
  termsAccordance: boolean;
  termsSuggestion: PeriodDto;
  termsAccordanceText: string;
};
