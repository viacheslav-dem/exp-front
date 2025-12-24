import {Component, EventEmitter, Input, Output, input} from "@angular/core";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
    selector: 'app-terms-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие сроков выполнения объекта государственной экспертизы необходимым:
      </label>
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
        <textarea [(ngModel)]="_form.termsAccordanceText" rows="3" class="form-control mt-05"
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

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set form(_form: { termsAccordance: boolean, termsSuggestion: PeriodDto, termsAccordanceText: string }) {
        this._form = _form;
        this._terms = new DateRange(this._form.termsSuggestion.start, _form.termsSuggestion.end);
    }

    onTermsChanged() {
        this._form.termsSuggestion = new PeriodDto(this._terms.start, this._terms.end);
    }

    stateButton(flag: boolean){
        if(flag){
            this._form.termsAccordance = true;
        } else {
            this._form.termsAccordance = false;
        }
    }

}
