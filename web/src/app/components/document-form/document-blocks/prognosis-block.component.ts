import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-prognosis-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка анализа текущего состояния и прогноза
        научно-технического развития соответствующей сферы планирования:
      </label>
      <app-boolean-button [(ngModel)]="_form().prognosis" [trueLabel]="'достаточна'"
        [falseLabel]="'недостаточна'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().prognosisText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Оцените достаточность и достоверность приведенного в материалах объекта экспертизы анализа текущего
            состояния и прогноза (тенденций) научно-технического развития сферы, соответствующей объекту экспертизы.
          </p>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class PrognosisBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    prognosis: boolean;
    prognosisText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
