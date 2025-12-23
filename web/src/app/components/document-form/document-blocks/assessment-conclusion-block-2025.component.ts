import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-assessment-conclusion-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{ num() }}. Оценка соответствия предложений поставщиков (подрядчиков, исполнителей), претендующих на участие в
        реализации мероприятий, целям названных мероприятий:
      </label>
      <input type="hidden" [(ngModel)]="_form().assessment" name="assessment" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().assessment === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().assessment === false}" (click)="stateButton(false)">
          Несоответствует
        </button>
      </div>
      @if (full()) {
        <textarea [(ngModel)]="_form().assessmentText" name="assessmentText" required minlength="30" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
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
export class AssessmentConclusionBlock2025Component {

  readonly num = input<string>("12.3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    assessment: boolean;
    assessmentText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  stateButton(flag: boolean){
    this._form().assessment = flag;
  }

}
