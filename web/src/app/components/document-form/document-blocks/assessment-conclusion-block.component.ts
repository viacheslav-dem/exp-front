import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-assessment-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка достаточности и соответствия предложений поставщиков
        (подрядчиков, исполнителей), претендующих на участие в реализации
        мероприятия, целям рассматриваемого мероприятия:
      </label>
      <app-boolean-button
        [(ngModel)]="_form().assessment"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().assessmentText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Дайте конкретную оценку по указанным параметрам для объекта экспертизы
            по представленным материалам объекта экспертизы.
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
export class AssessmentConclusionBlockComponent {

  readonly num = input<string>("12.3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    assessment: boolean;
    assessmentText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
