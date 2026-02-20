import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-assessment-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка научно-технического уровня, эффективности, достаточности и соответствия предложений
        поставщиков (подрядчиков, исполнителей), претендующих на участие в реализации мероприятия,
        целям рассматриваемого мероприятия.
      </label>
      <textarea
        [ngModel]="_form()?.assessment"
        (ngModelChange)="emitPatch({ assessment: $event })"
        [attr.name]="'assessment_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control"
      placeholder="Обязательный текст (не менее 30 символов)."></textarea>
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
export class AssessmentBlockComponent {

  readonly num = input<string>("9");

  readonly full = input<boolean>(true);

  readonly _form = input<AssessmentBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AssessmentBlockForm>>();

  emitPatch(patch: Partial<AssessmentBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type AssessmentBlockForm = {
  assessment: string;
};
