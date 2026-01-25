import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-consequences-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка возможных социальных, экономических и экологических последствий внедрения выбранных технологий
        и необходимости модернизации (реконструкции) взаимосвязанных действующих производственных объектов.
      </label>
      <textarea
        [ngModel]="_form()?.consequences"
        (ngModelChange)="emitPatch({ consequences: $event })"
        [attr.name]="'consequences_' + num().split('.').join('_')"
        required
        [attr.minlength]="minLen()"
        rows="3"
        class="form-control"
        [attr.placeholder]="minLen() ? ('Обязательный текст (не менее ' + minLen() + ' символов).') : 'Обязательный текст.'"
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
          </p>
          <p class="mb-0">Оцените:</p>
          <ul>
            <li>
              возможные позитивные и (или) негативные последствия в социальной и экономической
              сферах при внедрении предлагаемой в рамках реализации инвестиционного проекта технологии;
            </li>
            <li>
              влияние создаваемого объекта на экологию, в том числе в рамках конкретной местности,
              с указанием соответствующих видов и величин, результатов и затрат;
            </li>
            <li>
              систему менеджмента организации, его потенциальные возможности по осуществлению инвестиционного
              проекта, а также эксплуатацию объекта с учетом кадрового потенциала;
            </li>
            <li>
              обоснованность необходимости модернизации (реконструкции) взаимосвязанных
              действующих производственных объектов.
            </li>
          </ul>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
            Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ConsequencesBlockComponent {

  readonly num = input<string>("2.6");

  readonly full = input<boolean>(true);

  /**
   * Опционально: некоторые типы форм требуют минимум 30 символов (например, expert-review 8.9),
   * но для других форм это требование не всегда есть.
   * По умолчанию ограничение не применяется.
   */
  readonly minLen = input<number | null>(null);

  readonly _form = input<ConsequencesBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ConsequencesBlockForm>>();

  emitPatch(patch: Partial<ConsequencesBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ConsequencesBlockForm = {
  consequences: string;
};
