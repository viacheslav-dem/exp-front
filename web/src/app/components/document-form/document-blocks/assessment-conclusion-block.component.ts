import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-assessment-conclusion-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Оценка достаточности и соответствия предложений поставщиков
        (подрядчиков, исполнителей), претендующих на участие в реализации
        мероприятия, целям рассматриваемого мероприятия:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.assessment"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.assessmentText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
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
    </div>
  `
})
export class AssessmentConclusionBlockComponent {

  @Input()
  num: string = "12.3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { assessment: boolean, assessmentText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
