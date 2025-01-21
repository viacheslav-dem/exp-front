import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PeriodDto} from "@app/dto/PeriodDto";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";

@Component({
  selector: 'app-terms-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие сроков выполнения объекта государственной экспертизы необходимым:
      </label>
      <app-boolean-button [(ngModel)]="_form.termsAccordance" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <ng-container *ngIf="!_form.termsAccordance">
        <label>Рекомендуемые сроки реализации:</label>
        <div class="input-group">
          <app-date-period class="form-control" [(ngModel)]="_terms"
                           (ngModelChange)="onTermsChanged()"></app-date-period>
        </div>
      </ng-container>
      <textarea *ngIf="full" [(ngModel)]="_form.termsAccordanceText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class TermsAccordanceBlockComponent {

  _terms: DateRange;
  _form: { termsAccordance: boolean, termsSuggestion: PeriodDto, termsAccordanceText: string };

  @Input()
  num: string = "9.2";

  @Input()
  full: boolean = true;

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
}
