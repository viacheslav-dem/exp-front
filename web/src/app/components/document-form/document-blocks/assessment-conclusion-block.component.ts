import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-assessment-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка достаточности и соответствия предложений поставщиков
        (подрядчиков, исполнителей), претендующих на участие в реализации
        мероприятия, целям рассматриваемого мероприятия:
      </label>
      <input type="hidden" [ngModel]="_form()?.assessment" name="assessment" required>
      <app-boolean-button
        name="assessment"
        required
        [ngModel]="_form()?.assessment"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="emitPatch({ assessment: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.assessmentText" (ngModelChange)="emitPatch({ assessmentText: $event })" name="assessmentText" rows="3" class="form-control"
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

  readonly _form = input<AssessmentConclusionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AssessmentConclusionBlockForm>>();

  emitPatch(patch: Partial<AssessmentConclusionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type AssessmentConclusionBlockForm = {
  assessment: boolean;
  assessmentText: string;
};
