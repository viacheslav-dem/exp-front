import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-assessment-conclusion-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{ num() }}. Оценка соответствия предложений поставщиков (подрядчиков, исполнителей), претендующих на участие в
        реализации мероприятий, целям названных мероприятий:
      </label>
      <input type="hidden" [ngModel]="_form().assessment" name="assessment" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().assessment === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().assessment === false}" (click)="stateButton(false)">
          Несоответствует
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form().assessmentText"
          (ngModelChange)="emitPatch({ assessmentText: $event })"
          name="assessmentText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
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

  readonly _form = input<AssessmentConclusionBlock2025Form>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AssessmentConclusionBlock2025Form>>();

  emitPatch(patch: Partial<AssessmentConclusionBlock2025Form>) {
      // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
      this.formPatch.emit(patch);
      // Оставляем событие для обратной совместимости (часть форм привязана к нему).
      this.onConditionsChanged.emit(true);
  }

  stateButton(flag: boolean){
      this.emitPatch({ assessment: flag });
  }

}

type AssessmentConclusionBlock2025Form = {
    assessment: boolean;
    assessmentText: string;
};
