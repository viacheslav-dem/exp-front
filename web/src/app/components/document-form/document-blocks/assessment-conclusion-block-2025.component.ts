import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-assessment-conclusion-block-2025',
  template: `
    <div class="form-sub-group">
      <label>
        {{ num }}. Оценка соответствия предложений поставщиков (подрядчиков, исполнителей), претендующих на участие в
        реализации мероприятий, целям названных мероприятий:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.assessment === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.assessment === false}" (click)="stateButton(false)">
          Несоответствует
        </button>
      </div>
      <textarea *ngIf="full" [(ngModel)]="_form.assessmentText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
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
export class AssessmentConclusionBlock2025Component {

  @Input()
  num: string = "12.3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { assessment: boolean, assessmentText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  stateButton(flag: boolean){
    this._form.assessment = flag;
  }

}
